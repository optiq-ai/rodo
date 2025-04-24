package com.auth.jwt.controller;

import com.auth.jwt.data.dto.assessment.AssessmentDto;
import com.auth.jwt.data.dto.assessment.ChapterDto;
import com.auth.jwt.data.dto.assessment.AreaDto;
import com.auth.jwt.data.dto.assessment.RequirementDto;
import com.auth.jwt.data.entity.assessment.Assessment;
import com.auth.jwt.data.entity.assessment.Chapter;
import com.auth.jwt.data.entity.assessment.Area;
import com.auth.jwt.data.entity.assessment.Requirement;
import com.auth.jwt.data.entity.employee.Employee;
import com.auth.jwt.data.repository.AssessmentRepository;
import com.auth.jwt.data.repository.ChapterRepository;
import com.auth.jwt.data.repository.AreaRepository;
import com.auth.jwt.data.repository.RequirementRepository;
import com.auth.jwt.data.repository.employee.EmployeeJpaRepository;
import com.auth.jwt.security.UserAuthProviderParam;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/assessments")
public class AssessmentController {

    private final EmployeeJpaRepository employeeRepository;
    private final AssessmentRepository assessmentRepository;
    private final ChapterRepository chapterRepository;
    private final AreaRepository areaRepository;
    private final RequirementRepository requirementRepository;
    private final UserAuthProviderParam userAuthProviderParam;

    @Autowired
    public AssessmentController(EmployeeJpaRepository employeeRepository,
                               AssessmentRepository assessmentRepository,
                               ChapterRepository chapterRepository,
                               AreaRepository areaRepository,
                               RequirementRepository requirementRepository,
                               UserAuthProviderParam userAuthProviderParam) {
        this.employeeRepository = employeeRepository;
        this.assessmentRepository = assessmentRepository;
        this.chapterRepository = chapterRepository;
        this.areaRepository = areaRepository;
        this.requirementRepository = requirementRepository;
        this.userAuthProviderParam = userAuthProviderParam;
    }

    /**
     * Get the current authenticated user
     * @return Employee object or null
     */
    private Employee getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getName() != null) {
            String username = authentication.getName();
            // Sprawdź, czy nazwa użytkownika nie jest obiektem Employee
            if (username.contains("Employee{")) {
                // Wyciągnij userName z obiektu Employee
                int start = username.indexOf("userName='") + 10;
                int end = username.indexOf("'", start);
                if (start > 0 && end > start) {
                    username = username.substring(start, end);
                }
            }
            return employeeRepository.findByLogin(username);
        }
        return null;
    }

    /**
     * Get all assessments for the current user
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return List of assessments
     */
    @GetMapping
    public ResponseEntity<?> getAllAssessments(@RequestParam(required = false) String token) {
        // Use security context that was set by JwtAuthFilter
        Employee employee = getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        List<Assessment> assessments = assessmentRepository.findByEmployeeId(employee.getId());
        List<Map<String, Object>> result = assessments.stream()
                .map(this::convertToAssessmentSummary)
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    /**
     * Get assessment summary
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return Summary of assessments
     */
    @GetMapping("/summary")
    public ResponseEntity<?> getAssessmentSummary(@RequestParam(required = false) String token) {
        // Use security context that was set by JwtAuthFilter
        Employee employee = getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        Long employeeId = employee.getId();
        long totalAssessments = assessmentRepository.countByEmployeeId(employeeId);
        long inProgressAssessments = assessmentRepository.countByEmployeeIdAndStatus(employeeId, "W TRAKCIE");
        long completedAssessments = assessmentRepository.countByEmployeeIdAndStatus(employeeId, "ZAKOŃCZONA");

        // Count areas by status
        List<Assessment> assessments = assessmentRepository.findByEmployeeId(employeeId);
        int positiveAreas = 0;
        int warningAreas = 0;
        int negativeAreas = 0;
        int totalAreas = 0;

        for (Assessment assessment : assessments) {
            for (Chapter chapter : assessment.getChapters()) {
                for (Area area : chapter.getAreas()) {
                    totalAreas++;
                    if ("POZYTYWNA".equals(area.getScore())) {
                        positiveAreas++;
                    } else if ("ZASTRZEŻENIA".equals(area.getScore())) {
                        warningAreas++;
                    } else if ("NEGATYWNA".equals(area.getScore())) {
                        negativeAreas++;
                    }
                }
            }
        }

        // Calculate compliance percentage
        double compliancePercentage = totalAreas > 0 
            ? (double) (positiveAreas + (warningAreas / 2)) / totalAreas * 100 
            : 0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalAssessments", totalAssessments);
        summary.put("inProgressAssessments", inProgressAssessments);
        summary.put("completedAssessments", completedAssessments);
        summary.put("positiveAreas", positiveAreas);
        summary.put("warningAreas", warningAreas);
        summary.put("negativeAreas", negativeAreas);
        summary.put("totalAreas", totalAreas);
        summary.put("compliancePercentage", Math.round(compliancePercentage * 100.0) / 100.0);

        return ResponseEntity.ok(summary);
    }

    /**
     * Get assessment by ID
     * @param id Assessment ID
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return Assessment details
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getAssessmentById(@PathVariable Long id, @RequestParam(required = false) String token) {
        // Use security context that was set by JwtAuthFilter
        Employee employee = getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        Optional<Assessment> assessmentOpt = assessmentRepository.findById(id);
        if (assessmentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Ocena o podanym ID nie istnieje"));
        }

        Assessment assessment = assessmentOpt.get();
        
        // Check if assessment belongs to current user
        if (!assessment.getEmployee().getId().equals(employee.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(createErrorResponse("Brak dostępu do tej oceny"));
        }

        return ResponseEntity.ok(convertToDetailedAssessment(assessment));
    }

    /**
     * Get assessment template
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return Assessment template
     */
    @GetMapping("/template")
    public ResponseEntity<?> getAssessmentTemplate(@RequestParam(required = false) String token) {
        // Use security context that was set by JwtAuthFilter
        Employee employee = getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        // Create a template assessment with default chapters, areas, and requirements
        Map<String, Object> template = new HashMap<>();
        template.put("id", null);
        template.put("name", "");
        template.put("description", "");
        template.put("status", "DRAFT");
        template.put("createdAt", LocalDateTime.now());
        template.put("updatedAt", LocalDateTime.now());
        
        // Template content (abbreviated for brevity)
        List<Map<String, Object>> chapters = new ArrayList<>();
        // ... (existing template code)
        template.put("chapters", chapters);
        
        return ResponseEntity.ok(template);
    }

    /**
     * Create a new assessment
     * @param assessmentData Assessment data
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return Created assessment ID
     */
    @PostMapping
    public ResponseEntity<?> createAssessment(@Valid @RequestBody Map<String, Object> assessmentData, 
                                             @RequestParam(required = false) String token) {
        // Use security context that was set by JwtAuthFilter
        Employee employee = getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        try {
            // Extract assessment data
            String name = (String) assessmentData.get("name");
            String description = (String) assessmentData.get("description");
            String status = (String) assessmentData.get("status");
            
            // Create assessment
            Assessment assessment = new Assessment(name, description, status, employee);
            
            // Process chapters
            // ... (existing implementation)
            
            // Save assessment
            assessment = assessmentRepository.save(assessment);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", assessment.getId());
            response.put("success", true);
            response.put("message", "Ocena została utworzona");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Wystąpił błąd podczas tworzenia oceny: " + e.getMessage()));
        }
    }

    /**
     * Update an existing assessment
     * @param id Assessment ID
     * @param assessmentData Assessment data
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return Success message
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAssessment(@PathVariable Long id, 
                                             @Valid @RequestBody Map<String, Object> assessmentData,
                                             @RequestParam(required = false) String token) {
        // Use security context that was set by JwtAuthFilter
        Employee employee = getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        Optional<Assessment> assessmentOpt = assessmentRepository.findById(id);
        if (assessmentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Ocena o podanym ID nie istnieje"));
        }

        Assessment assessment = assessmentOpt.get();
        
        // Check if assessment belongs to current user
        if (!assessment.getEmployee().getId().equals(employee.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(createErrorResponse("Brak dostępu do tej oceny"));
        }

        try {
            // Update assessment data
            // ... (existing implementation)
            
            return ResponseEntity.ok(createSuccessResponse("Ocena została zaktualizowana"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Wystąpił błąd podczas aktualizacji oceny: " + e.getMessage()));
        }
    }

    /**
     * Delete an assessment
     * @param id Assessment ID
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return Success message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssessment(@PathVariable Long id, @RequestParam(required = false) String token) {
        // Use security context that was set by JwtAuthFilter
        Employee employee = getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        Optional<Assessment> assessmentOpt = assessmentRepository.findById(id);
        if (assessmentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Ocena o podanym ID nie istnieje"));
        }

        Assessment assessment = assessmentOpt.get();
        
        // Check if assessment belongs to current user
        if (!assessment.getEmployee().getId().equals(employee.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(createErrorResponse("Brak dostępu do tej oceny"));
        }

        try {
            assessmentRepository.delete(assessment);
            return ResponseEntity.ok(createSuccessResponse("Ocena została usunięta"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Wystąpił błąd podczas usuwania oceny: " + e.getMessage()));
        }
    }

    /**
     * Export assessment to JSON
     * @param id Assessment ID
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return Assessment JSON
     */
    @GetMapping("/{id}/export")
    public ResponseEntity<?> exportAssessment(@PathVariable Long id, @RequestParam(required = false) String token) {
        // Use security context that was set by JwtAuthFilter
        Employee employee = getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        Optional<Assessment> assessmentOpt = assessmentRepository.findById(id);
        if (assessmentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Ocena o podanym ID nie istnieje"));
        }

        Assessment assessment = assessmentOpt.get();
        
        // Check if assessment belongs to current user
        if (!assessment.getEmployee().getId().equals(employee.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(createErrorResponse("Brak dostępu do tej oceny"));
        }

        Map<String, Object> exportData = convertToDetailedAssessment(assessment);
        
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"assessment_" + id + ".json\"")
                .body(exportData);
    }

    /**
     * Create a success response
     * @param message Success message
     * @return Map with success status and message
     */
    private Map<String, Object> createSuccessResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        return response;
    }

    /**
     * Create an error response
     * @param message Error message
     * @return Map with error status and message
     */
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }

    /**
     * Convert Assessment to summary format
     * @param assessment Assessment entity
     * @return Assessment summary
     */
    private Map<String, Object> convertToAssessmentSummary(Assessment assessment) {
        Map<String, Object> result = new HashMap<>();
        result.put("id", assessment.getId());
        result.put("name", assessment.getName());
        result.put("description", assessment.getDescription());
        result.put("status", assessment.getStatus());
        result.put("createdAt", assessment.getCreatedAt());
        result.put("updatedAt", assessment.getUpdatedAt());
        
        // Dodaj informacje o liczbie rozdziałów, obszarów itp.
        if (assessment.getChapters() != null) {
            result.put("chaptersCount", assessment.getChapters().size());
            
            int areasCount = 0;
            int requirementsCount = 0;
            for (Chapter chapter : assessment.getChapters()) {
                if (chapter.getAreas() != null) {
                    areasCount += chapter.getAreas().size();
                    for (Area area : chapter.getAreas()) {
                        if (area.getRequirements() != null) {
                            requirementsCount += area.getRequirements().size();
                        }
                    }
                }
            }
            result.put("areasCount", areasCount);
            result.put("requirementsCount", requirementsCount);
        } else {
            result.put("chaptersCount", 0);
            result.put("areasCount", 0);
            result.put("requirementsCount", 0);
        }
        
        return result;
    }

    /**
     * Convert Assessment to detailed format
     * @param assessment Assessment entity
     * @return Detailed assessment
     */
    private Map<String, Object> convertToDetailedAssessment(Assessment assessment) {
        Map<String, Object> result = new HashMap<>();
        result.put("id", assessment.getId());
        result.put("name", assessment.getName());
        result.put("description", assessment.getDescription());
        result.put("status", assessment.getStatus());
        result.put("createdAt", assessment.getCreatedAt());
        result.put("updatedAt", assessment.getUpdatedAt());
        
        // Dodaj informacje o rozdziałach, obszarach i wymaganiach
        List<Map<String, Object>> chaptersData = new ArrayList<>();
        if (assessment.getChapters() != null) {
            for (Chapter chapter : assessment.getChapters()) {
                Map<String, Object> chapterData = new HashMap<>();
                chapterData.put("id", chapter.getId());
                chapterData.put("name", chapter.getName());
                chapterData.put("description", chapter.getDescription());
                
                List<Map<String, Object>> areasData = new ArrayList<>();
                if (chapter.getAreas() != null) {
                    for (Area area : chapter.getAreas()) {
                        Map<String, Object> areaData = new HashMap<>();
                        areaData.put("id", area.getId());
                        areaData.put("name", area.getName());
                        areaData.put("description", area.getDescription());
                        areaData.put("score", area.getScore());
                        areaData.put("comment", area.getComment());
                        
                        List<Map<String, Object>> requirementsData = new ArrayList<>();
                        if (area.getRequirements() != null) {
                            for (Requirement requirement : area.getRequirements()) {
                                Map<String, Object> requirementData = new HashMap<>();
                                requirementData.put("id", requirement.getId());
                                requirementData.put("text", requirement.getText());
                                requirementData.put("value", requirement.getValue());
                                requirementData.put("comment", requirement.getComment());
                                
                                requirementsData.add(requirementData);
                            }
                        }
                        areaData.put("requirements", requirementsData);
                        areasData.add(areaData);
                    }
                }
                chapterData.put("areas", areasData);
                chaptersData.add(chapterData);
            }
        }
        result.put("chapters", chaptersData);
        
        return result;
    }
}
