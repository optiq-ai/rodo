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

    @Autowired
    public AssessmentController(EmployeeJpaRepository employeeRepository,
                               AssessmentRepository assessmentRepository,
                               ChapterRepository chapterRepository,
                               AreaRepository areaRepository,
                               RequirementRepository requirementRepository) {
        this.employeeRepository = employeeRepository;
        this.assessmentRepository = assessmentRepository;
        this.chapterRepository = chapterRepository;
        this.areaRepository = areaRepository;
        this.requirementRepository = requirementRepository;
    }

    /**
     * Get the current authenticated user
     * @return Employee object or null
     */
    private Employee getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getName() != null) {
            return employeeRepository.findByLogin(authentication.getName());
        }
        return null;
    }

    /**
     * Get all assessments for the current user
     * @return List of assessments
     */
    @GetMapping
    public ResponseEntity<?> getAllAssessments() {
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
     * @return Summary of assessments
     */
    @GetMapping("/summary")
    public ResponseEntity<?> getAssessmentSummary() {
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
     * @return Assessment details
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getAssessmentById(@PathVariable Long id) {
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
     * @return Assessment template
     */
    @GetMapping("/template")
    public ResponseEntity<?> getAssessmentTemplate() {
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
        
        List<Map<String, Object>> chapters = new ArrayList<>();
        
        // Chapter 1: Podstawowe zasady ochrony danych
        Map<String, Object> chapter1 = new HashMap<>();
        chapter1.put("id", null);
        chapter1.put("name", "Podstawowe zasady ochrony danych");
        chapter1.put("description", "Ocena zgodności z podstawowymi zasadami ochrony danych osobowych");
        
        List<Map<String, Object>> areas1 = new ArrayList<>();
        
        // Area 1.1: Zgodność z zasadami przetwarzania danych
        Map<String, Object> area1 = new HashMap<>();
        area1.put("id", null);
        area1.put("name", "Zgodność z zasadami przetwarzania danych");
        area1.put("description", "Ocena zgodności z podstawowymi zasadami przetwarzania danych osobowych");
        area1.put("score", null);
        area1.put("comment", "");
        
        List<Map<String, Object>> requirements1 = new ArrayList<>();
        
        Map<String, Object> req1 = new HashMap<>();
        req1.put("id", null);
        req1.put("text", "Czy dane osobowe są przetwarzane zgodnie z zasadą legalności?");
        req1.put("value", null);
        req1.put("comment", "");
        requirements1.add(req1);
        
        Map<String, Object> req2 = new HashMap<>();
        req2.put("id", null);
        req2.put("text", "Czy dane osobowe są przetwarzane zgodnie z zasadą rzetelności?");
        req2.put("value", null);
        req2.put("comment", "");
        requirements1.add(req2);
        
        Map<String, Object> req3 = new HashMap<>();
        req3.put("id", null);
        req3.put("text", "Czy dane osobowe są przetwarzane zgodnie z zasadą przejrzystości?");
        req3.put("value", null);
        req3.put("comment", "");
        requirements1.add(req3);
        
        area1.put("requirements", requirements1);
        areas1.add(area1);
        
        // Area 1.2: Minimalizacja danych
        Map<String, Object> area2 = new HashMap<>();
        area2.put("id", null);
        area2.put("name", "Minimalizacja danych");
        area2.put("description", "Ocena zgodności z zasadą minimalizacji danych");
        area2.put("score", null);
        area2.put("comment", "");
        
        List<Map<String, Object>> requirements2 = new ArrayList<>();
        
        Map<String, Object> req4 = new HashMap<>();
        req4.put("id", null);
        req4.put("text", "Czy przetwarzane są tylko dane niezbędne do realizacji celu?");
        req4.put("value", null);
        req4.put("comment", "");
        requirements2.add(req4);
        
        Map<String, Object> req5 = new HashMap<>();
        req5.put("id", null);
        req5.put("text", "Czy dane są usuwane po osiągnięciu celu przetwarzania?");
        req5.put("value", null);
        req5.put("comment", "");
        requirements2.add(req5);
        
        area2.put("requirements", requirements2);
        areas1.add(area2);
        
        chapter1.put("areas", areas1);
        chapters.add(chapter1);
        
        // Chapter 2: Prawa osób, których dane dotyczą
        Map<String, Object> chapter2 = new HashMap<>();
        chapter2.put("id", null);
        chapter2.put("name", "Prawa osób, których dane dotyczą");
        chapter2.put("description", "Ocena realizacji praw osób, których dane dotyczą");
        
        List<Map<String, Object>> areas2 = new ArrayList<>();
        
        // Area 2.1: Prawo dostępu do danych
        Map<String, Object> area3 = new HashMap<>();
        area3.put("id", null);
        area3.put("name", "Prawo dostępu do danych");
        area3.put("description", "Ocena realizacji prawa dostępu do danych");
        area3.put("score", null);
        area3.put("comment", "");
        
        List<Map<String, Object>> requirements3 = new ArrayList<>();
        
        Map<String, Object> req6 = new HashMap<>();
        req6.put("id", null);
        req6.put("text", "Czy organizacja posiada procedurę realizacji prawa dostępu do danych?");
        req6.put("value", null);
        req6.put("comment", "");
        requirements3.add(req6);
        
        Map<String, Object> req7 = new HashMap<>();
        req7.put("id", null);
        req7.put("text", "Czy organizacja realizuje prawo dostępu do danych w terminie 30 dni?");
        req7.put("value", null);
        req7.put("comment", "");
        requirements3.add(req7);
        
        area3.put("requirements", requirements3);
        areas2.add(area3);
        
        chapter2.put("areas", areas2);
        chapters.add(chapter2);
        
        template.put("chapters", chapters);
        
        return ResponseEntity.ok(template);
    }

    /**
     * Create a new assessment
     * @param assessmentData Assessment data
     * @return Created assessment ID
     */
    @PostMapping
    public ResponseEntity<?> createAssessment(@Valid @RequestBody Map<String, Object> assessmentData) {
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
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> chaptersData = (List<Map<String, Object>>) assessmentData.get("chapters");
            if (chaptersData != null) {
                for (Map<String, Object> chapterData : chaptersData) {
                    Chapter chapter = new Chapter(
                        (String) chapterData.get("name"),
                        (String) chapterData.get("description")
                    );
                    assessment.addChapter(chapter);
                    
                    // Process areas
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> areasData = (List<Map<String, Object>>) chapterData.get("areas");
                    if (areasData != null) {
                        for (Map<String, Object> areaData : areasData) {
                            Area area = new Area(
                                (String) areaData.get("name"),
                                (String) areaData.get("description"),
                                (String) areaData.get("score"),
                                (String) areaData.get("comment")
                            );
                            chapter.addArea(area);
                            
                            // Process requirements
                            @SuppressWarnings("unchecked")
                            List<Map<String, Object>> requirementsData = (List<Map<String, Object>>) areaData.get("requirements");
                            if (requirementsData != null) {
                                for (Map<String, Object> requirementData : requirementsData) {
                                    Requirement requirement = new Requirement(
                                        (String) requirementData.get("text"),
                                        (String) requirementData.get("value"),
                                        (String) requirementData.get("comment")
                                    );
                                    area.addRequirement(requirement);
                                }
                            }
                        }
                    }
                }
            }
            
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
     * @return Success message
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAssessment(@PathVariable Long id, @Valid @RequestBody Map<String, Object> assessmentData) {
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
            assessment.setName((String) assessmentData.get("name"));
            assessment.setDescription((String) assessmentData.get("description"));
            assessment.setStatus((String) assessmentData.get("status"));
            assessment.setUpdatedAt(LocalDateTime.now());
            
            // Clear existing chapters and create new ones
            assessment.getChapters().clear();
            
            // Process chapters
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> chaptersData = (List<Map<String, Object>>) assessmentData.get("chapters");
            if (chaptersData != null) {
                for (Map<String, Object> chapterData : chaptersData) {
                    Chapter chapter = new Chapter(
                        (String) chapterData.get("name"),
                        (String) chapterData.get("description")
                    );
                    assessment.addChapter(chapter);
                    
                    // Process areas
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> areasData = (List<Map<String, Object>>) chapterData.get("areas");
                    if (areasData != null) {
                        for (Map<String, Object> areaData : areasData) {
                            Area area = new Area(
                                (String) areaData.get("name"),
                                (String) areaData.get("description"),
                                (String) areaData.get("score"),
                                (String) areaData.get("comment")
                            );
                            chapter.addArea(area);
                            
                            // Process requirements
                            @SuppressWarnings("unchecked")
                            List<Map<String, Object>> requirementsData = (List<Map<String, Object>>) areaData.get("requirements");
                            if (requirementsData != null) {
                                for (Map<String, Object> requirementData : requirementsData) {
                                    Requirement requirement = new Requirement(
                                        (String) requirementData.get("text"),
                                        (String) requirementData.get("value"),
                                        (String) requirementData.get("comment")
                                    );
                                    area.addRequirement(requirement);
                                }
                            }
                        }
                    }
                }
            }
            
            // Save assessment
            assessmentRepository.save(assessment);
            
            return ResponseEntity.ok(createSuccessResponse("Ocena została zaktualizowana"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Wystąpił błąd podczas aktualizacji oceny: " + e.getMessage()));
        }
    }

    /**
     * Delete an assessment
     * @param id Assessment ID
     * @return Success message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssessment(@PathVariable Long id) {
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
     * @return Assessment JSON
     */
    @GetMapping("/{id}/export")
    public ResponseEntity<?> exportAssessment(@PathVariable Long id) {
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
     * Convert Assessment to summary format
     * @param assessment Assessment entity
     * @return Assessment summary
     */
    private Map<String, Object> convertToAssessmentSummary(Assessment assessment) {
        Map<String, Object> result = new HashMap<>();
        result.put("id", assessment.getId());
        result.put("name", assessment.getName());
        result.put("createdAt", assessment.getCreatedAt());
        result.put("status", assessment.getStatus());
        
        // Calculate progress
        int totalRequirements = 0;
        int completedRequirements = 0;
        int positiveAreas = 0;
        int warningAreas = 0;
        int negativeAreas = 0;
        
        for (Chapter chapter : assessment.getChapters()) {
            for (Area area : chapter.getAreas()) {
                if ("POZYTYWNA".equals(area.getScore())) {
                    positiveAreas++;
                } else if ("ZASTRZEŻENIA".equals(area.getScore())) {
                    warningAreas++;
                } else if ("NEGATYWNA".equals(area.getScore())) {
                    negativeAreas++;
                }
                
                for (Requirement requirement : area.getRequirements()) {
                    totalRequirements++;
                    if (requirement.getValue() != null && !requirement.getValue().isEmpty() && !"W REALIZACJI".equals(requirement.getValue())) {
                        completedRequirements++;
                    }
                }
            }
        }
        
        int progress = totalRequirements > 0 ? (completedRequirements * 100) / totalRequirements : 0;
        
        result.put("progress", progress);
        result.put("positiveAreas", positiveAreas);
        result.put("warningAreas", warningAreas);
        result.put("negativeAreas", negativeAreas);
        
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
        
        List<Map<String, Object>> chapters = new ArrayList<>();
        for (Chapter chapter : assessment.getChapters()) {
            Map<String, Object> chapterMap = new HashMap<>();
            chapterMap.put("id", chapter.getId());
            chapterMap.put("name", chapter.getName());
            chapterMap.put("description", chapter.getDescription());
            
            List<Map<String, Object>> areas = new ArrayList<>();
            for (Area area : chapter.getAreas()) {
                Map<String, Object> areaMap = new HashMap<>();
                areaMap.put("id", area.getId());
                areaMap.put("name", area.getName());
                areaMap.put("description", area.getDescription());
                areaMap.put("score", area.getScore());
                areaMap.put("comment", area.getComment());
                
                List<Map<String, Object>> requirements = new ArrayList<>();
                for (Requirement requirement : area.getRequirements()) {
                    Map<String, Object> requirementMap = new HashMap<>();
                    requirementMap.put("id", requirement.getId());
                    requirementMap.put("text", requirement.getText());
                    requirementMap.put("value", requirement.getValue());
                    requirementMap.put("comment", requirement.getComment());
                    requirements.add(requirementMap);
                }
                
                areaMap.put("requirements", requirements);
                areas.add(areaMap);
            }
            
            chapterMap.put("areas", areas);
            chapters.add(chapterMap);
        }
        
        result.put("chapters", chapters);
        
        return result;
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
}
