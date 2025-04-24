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
        System.out.println("Processing request: GET /assessments/" + id + (token != null ? "?token=" + token : ""));
        
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
        
        // Template content with sample chapters, areas, and requirements
        List<Map<String, Object>> chapters = new ArrayList<>();
        
        // Chapter 1
        Map<String, Object> chapter1 = new HashMap<>();
        chapter1.put("id", 1);
        chapter1.put("name", "I. Organizacja systemu ochrony DO");
        chapter1.put("description", "Planowanie i organizacja systemu ochrony danych osobowych");
        
        List<Map<String, Object>> areas1 = new ArrayList<>();
        
        // Area 1.1
        Map<String, Object> area11 = new HashMap<>();
        area11.put("id", 1);
        area11.put("name", "I.1 Polityka w zakresie ochrony DO");
        area11.put("description", "Polityka i procedury przetwarzania danych osobowych");
        area11.put("score", "");
        area11.put("comment", "");
        
        List<Map<String, Object>> requirements11 = new ArrayList<>();
        
        Map<String, Object> req1 = new HashMap<>();
        req1.put("id", 1);
        req1.put("text", "Czy opracowano i wdrożono politykę ochrony danych osobowych?");
        req1.put("value", "");
        req1.put("status", "NOT_STARTED");
        req1.put("comment", "");
        requirements11.add(req1);
        
        Map<String, Object> req2 = new HashMap<>();
        req2.put("id", 2);
        req2.put("text", "Czy polityka ochrony danych osobowych jest aktualna i zgodna z RODO?");
        req2.put("value", "");
        req2.put("status", "NOT_STARTED");
        req2.put("comment", "");
        requirements11.add(req2);
        
        Map<String, Object> req3 = new HashMap<>();
        req3.put("id", 3);
        req3.put("text", "Czy pracownicy zostali zapoznani z polityką ochrony danych osobowych?");
        req3.put("value", "");
        req3.put("status", "NOT_STARTED");
        req3.put("comment", "");
        requirements11.add(req3);
        
        area11.put("requirements", requirements11);
        areas1.add(area11);
        
        // Area 1.2
        Map<String, Object> area12 = new HashMap<>();
        area12.put("id", 2);
        area12.put("name", "I.2 Wyznaczenie ADO");
        area12.put("description", "Wyznaczenie Administratora Danych Osobowych");
        area12.put("score", "");
        area12.put("comment", "");
        
        List<Map<String, Object>> requirements12 = new ArrayList<>();
        
        Map<String, Object> req4 = new HashMap<>();
        req4.put("id", 4);
        req4.put("text", "Czy w jednostce nastąpiło powierzenie zadań ADO wyznaczonym podmiotom?");
        req4.put("value", "");
        req4.put("status", "NOT_STARTED");
        req4.put("comment", "");
        requirements12.add(req4);
        
        Map<String, Object> req5 = new HashMap<>();
        req5.put("id", 5);
        req5.put("text", "Czy zakres zadań ADO został jasno określony?");
        req5.put("value", "");
        req5.put("status", "NOT_STARTED");
        req5.put("comment", "");
        requirements12.add(req5);
        
        area12.put("requirements", requirements12);
        areas1.add(area12);
        
        chapter1.put("areas", areas1);
        chapters.add(chapter1);
        
        // Chapter 2
        Map<String, Object> chapter2 = new HashMap<>();
        chapter2.put("id", 2);
        chapter2.put("name", "II. Prawo do przetwarzania DO");
        chapter2.put("description", "Zapewnienie poprawności procesów przetwarzania danych osobowych");
        
        List<Map<String, Object>> areas2 = new ArrayList<>();
        
        // Area 2.1
        Map<String, Object> area21 = new HashMap<>();
        area21.put("id", 3);
        area21.put("name", "II.1 Podstawy prawne przetwarzania DO");
        area21.put("description", "Podstawy prawne przetwarzania danych osobowych");
        area21.put("score", "");
        area21.put("comment", "");
        
        List<Map<String, Object>> requirements21 = new ArrayList<>();
        
        Map<String, Object> req6 = new HashMap<>();
        req6.put("id", 6);
        req6.put("text", "Czy zidentyfikowano podstawy prawne przetwarzania danych osobowych?");
        req6.put("value", "");
        req6.put("status", "NOT_STARTED");
        req6.put("comment", "");
        requirements21.add(req6);
        
        area21.put("requirements", requirements21);
        areas2.add(area21);
        
        chapter2.put("areas", areas2);
        chapters.add(chapter2);
        
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
        System.out.println("Processing request: POST /assessments" + (token != null ? "?token=" + token : ""));
        System.out.println("Creating new assessment: " + assessmentData);
        
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
            assessment.setCreatedAt(LocalDateTime.now());
            assessment.setUpdatedAt(LocalDateTime.now());
            
            // Save assessment first to get ID
            assessment = assessmentRepository.save(assessment);
            
            // Process chapters if present
            if (assessmentData.containsKey("chapters")) {
                List<Map<String, Object>> chaptersData = (List<Map<String, Object>>) assessmentData.get("chapters");
                if (chaptersData != null) {
                    for (Map<String, Object> chapterData : chaptersData) {
                        // Create chapter
                        Chapter chapter = new Chapter();
                        chapter.setName((String) chapterData.get("name"));
                        chapter.setDescription((String) chapterData.get("description"));
                        chapter.setAssessment(assessment);
                        
                        // Save chapter
                        chapter = chapterRepository.save(chapter);
                        
                        // Process areas if present
                        if (chapterData.containsKey("areas")) {
                            List<Map<String, Object>> areasData = (List<Map<String, Object>>) chapterData.get("areas");
                            if (areasData != null) {
                                for (Map<String, Object> areaData : areasData) {
                                    // Create area
                                    Area area = new Area();
                                    area.setName((String) areaData.get("name"));
                                    area.setDescription((String) areaData.get("description"));
                                    area.setScore((String) areaData.get("score"));
                                    area.setComment((String) areaData.get("comment"));
                                    area.setChapter(chapter);
                                    
                                    // Save area
                                    area = areaRepository.save(area);
                                    
                                    // Process requirements if present
                                    if (areaData.containsKey("requirements")) {
                                        List<Map<String, Object>> requirementsData = (List<Map<String, Object>>) areaData.get("requirements");
                                        if (requirementsData != null) {
                                            for (Map<String, Object> requirementData : requirementsData) {
                                                // Create requirement
                                                Requirement requirement = new Requirement();
                                                requirement.setText((String) requirementData.get("text"));
                                                requirement.setValue((String) requirementData.get("value"));
                                                requirement.setStatus((String) requirementData.get("status"));
                                                requirement.setComment((String) requirementData.get("comment"));
                                                requirement.setArea(area);
                                                
                                                // Save requirement
                                                requirementRepository.save(requirement);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            // Calculate progress
            int progress = calculateProgress(assessment.getId());
            assessment.setProgress(progress);
            
            // Update status based on progress
            if (progress == 100) {
                assessment.setStatus("ZAKOŃCZONA");
            } else if (progress > 0) {
                assessment.setStatus("W TRAKCIE");
            }
            
            // Save updated assessment
            assessmentRepository.save(assessment);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", assessment.getId());
            response.put("success", true);
            response.put("message", "Ocena została utworzona");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            e.printStackTrace();
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
        System.out.println("Processing request: PUT /assessments/" + id + (token != null ? "?token=" + token : ""));
        System.out.println("Aktualizacja oceny: " + assessmentData);
        
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
            assessment.setName((String) assessmentData.get("name"));
            assessment.setDescription((String) assessmentData.get("description"));
            assessment.setUpdatedAt(LocalDateTime.now());
            
            // Save assessment first
            assessment = assessmentRepository.save(assessment);
            
            // Process chapters if present
            if (assessmentData.containsKey("chapters")) {
                List<Map<String, Object>> chaptersData = (List<Map<String, Object>>) assessmentData.get("chapters");
                if (chaptersData != null) {
                    // Create a map of existing chapters by ID for quick lookup
                    Map<Long, Chapter> existingChapters = new HashMap<>();
                    for (Chapter chapter : assessment.getChapters()) {
                        existingChapters.put(chapter.getId(), chapter);
                    }
                    
                    // Track processed chapters to identify which ones to delete
                    Set<Long> processedChapterIds = new HashSet<>();
                    
                    for (Map<String, Object> chapterData : chaptersData) {
                        Chapter chapter;
                        Long chapterId = null;
                        
                        // Check if chapter has an ID and exists
                        if (chapterData.containsKey("id") && chapterData.get("id") != null) {
                            try {
                                chapterId = Long.valueOf(chapterData.get("id").toString());
                                if (existingChapters.containsKey(chapterId)) {
                                    // Update existing chapter
                                    chapter = existingChapters.get(chapterId);
                                    chapter.setName((String) chapterData.get("name"));
                                    chapter.setDescription((String) chapterData.get("description"));
                                    processedChapterIds.add(chapterId);
                                } else {
                                    // Create new chapter with specified ID
                                    chapter = new Chapter();
                                    chapter.setName((String) chapterData.get("name"));
                                    chapter.setDescription((String) chapterData.get("description"));
                                    chapter.setAssessment(assessment);
                                }
                            } catch (NumberFormatException e) {
                                // ID is not a valid Long, create new chapter
                                chapter = new Chapter();
                                chapter.setName((String) chapterData.get("name"));
                                chapter.setDescription((String) chapterData.get("description"));
                                chapter.setAssessment(assessment);
                            }
                        } else {
                            // Create new chapter
                            chapter = new Chapter();
                            chapter.setName((String) chapterData.get("name"));
                            chapter.setDescription((String) chapterData.get("description"));
                            chapter.setAssessment(assessment);
                        }
                        
                        // Save chapter
                        chapter = chapterRepository.save(chapter);
                        
                        // Process areas if present
                        if (chapterData.containsKey("areas")) {
                            List<Map<String, Object>> areasData = (List<Map<String, Object>>) chapterData.get("areas");
                            if (areasData != null) {
                                // Create a map of existing areas by ID for quick lookup
                                Map<Long, Area> existingAreas = new HashMap<>();
                                for (Area area : chapter.getAreas()) {
                                    existingAreas.put(area.getId(), area);
                                }
                                
                                // Track processed areas to identify which ones to delete
                                Set<Long> processedAreaIds = new HashSet<>();
                                
                                for (Map<String, Object> areaData : areasData) {
                                    Area area;
                                    Long areaId = null;
                                    
                                    // Check if area has an ID and exists
                                    if (areaData.containsKey("id") && areaData.get("id") != null) {
                                        try {
                                            areaId = Long.valueOf(areaData.get("id").toString());
                                            if (existingAreas.containsKey(areaId)) {
                                                // Update existing area
                                                area = existingAreas.get(areaId);
                                                area.setName((String) areaData.get("name"));
                                                area.setDescription((String) areaData.get("description"));
                                                area.setScore((String) areaData.get("score"));
                                                area.setComment((String) areaData.get("comment"));
                                                processedAreaIds.add(areaId);
                                            } else {
                                                // Create new area with specified ID
                                                area = new Area();
                                                area.setName((String) areaData.get("name"));
                                                area.setDescription((String) areaData.get("description"));
                                                area.setScore((String) areaData.get("score"));
                                                area.setComment((String) areaData.get("comment"));
                                                area.setChapter(chapter);
                                            }
                                        } catch (NumberFormatException e) {
                                            // ID is not a valid Long, create new area
                                            area = new Area();
                                            area.setName((String) areaData.get("name"));
                                            area.setDescription((String) areaData.get("description"));
                                            area.setScore((String) areaData.get("score"));
                                            area.setComment((String) areaData.get("comment"));
                                            area.setChapter(chapter);
                                        }
                                    } else {
                                        // Create new area
                                        area = new Area();
                                        area.setName((String) areaData.get("name"));
                                        area.setDescription((String) areaData.get("description"));
                                        area.setScore((String) areaData.get("score"));
                                        area.setComment((String) areaData.get("comment"));
                                        area.setChapter(chapter);
                                    }
                                    
                                    // Save area
                                    area = areaRepository.save(area);
                                    
                                    // Process requirements if present
                                    if (areaData.containsKey("requirements")) {
                                        List<Map<String, Object>> requirementsData = (List<Map<String, Object>>) areaData.get("requirements");
                                        if (requirementsData != null) {
                                            // Create a map of existing requirements by ID for quick lookup
                                            Map<Long, Requirement> existingRequirements = new HashMap<>();
                                            for (Requirement requirement : area.getRequirements()) {
                                                existingRequirements.put(requirement.getId(), requirement);
                                            }
                                            
                                            // Track processed requirements to identify which ones to delete
                                            Set<Long> processedRequirementIds = new HashSet<>();
                                            
                                            for (Map<String, Object> requirementData : requirementsData) {
                                                Requirement requirement;
                                                Long requirementId = null;
                                                
                                                // Check if requirement has an ID and exists
                                                if (requirementData.containsKey("id") && requirementData.get("id") != null) {
                                                    try {
                                                        requirementId = Long.valueOf(requirementData.get("id").toString());
                                                        if (existingRequirements.containsKey(requirementId)) {
                                                            // Update existing requirement
                                                            requirement = existingRequirements.get(requirementId);
                                                            requirement.setText((String) requirementData.get("text"));
                                                            requirement.setValue((String) requirementData.get("value"));
                                                            requirement.setStatus((String) requirementData.get("status"));
                                                            requirement.setComment((String) requirementData.get("comment"));
                                                            processedRequirementIds.add(requirementId);
                                                        } else {
                                                            // Create new requirement with specified ID
                                                            requirement = new Requirement();
                                                            requirement.setText((String) requirementData.get("text"));
                                                            requirement.setValue((String) requirementData.get("value"));
                                                            requirement.setStatus((String) requirementData.get("status"));
                                                            requirement.setComment((String) requirementData.get("comment"));
                                                            requirement.setArea(area);
                                                        }
                                                    } catch (NumberFormatException e) {
                                                        // ID is not a valid Long, create new requirement
                                                        requirement = new Requirement();
                                                        requirement.setText((String) requirementData.get("text"));
                                                        requirement.setValue((String) requirementData.get("value"));
                                                        requirement.setStatus((String) requirementData.get("status"));
                                                        requirement.setComment((String) requirementData.get("comment"));
                                                        requirement.setArea(area);
                                                    }
                                                } else {
                                                    // Create new requirement
                                                    requirement = new Requirement();
                                                    requirement.setText((String) requirementData.get("text"));
                                                    requirement.setValue((String) requirementData.get("value"));
                                                    requirement.setStatus((String) requirementData.get("status"));
                                                    requirement.setComment((String) requirementData.get("comment"));
                                                    requirement.setArea(area);
                                                }
                                                
                                                // Save requirement
                                                requirementRepository.save(requirement);
                                            }
                                            
                                            // Delete requirements that were not processed
                                            for (Long existingRequirementId : existingRequirements.keySet()) {
                                                if (!processedRequirementIds.contains(existingRequirementId)) {
                                                    requirementRepository.deleteById(existingRequirementId);
                                                }
                                            }
                                        }
                                    }
                                }
                                
                                // Delete areas that were not processed
                                for (Long existingAreaId : existingAreas.keySet()) {
                                    if (!processedAreaIds.contains(existingAreaId)) {
                                        areaRepository.deleteById(existingAreaId);
                                    }
                                }
                            }
                        }
                    }
                    
                    // Delete chapters that were not processed
                    for (Long existingChapterId : existingChapters.keySet()) {
                        if (!processedChapterIds.contains(existingChapterId)) {
                            chapterRepository.deleteById(existingChapterId);
                        }
                    }
                }
            }
            
            // Calculate progress
            int progress = calculateProgress(assessment.getId());
            assessment.setProgress(progress);
            
            // Update status based on progress
            if (progress == 100) {
                assessment.setStatus("ZAKOŃCZONA");
            } else if (progress > 0) {
                assessment.setStatus("W TRAKCIE");
            } else {
                assessment.setStatus("DRAFT");
            }
            
            // Save updated assessment
            assessmentRepository.save(assessment);
            
            // Return the updated assessment
            Map<String, Object> response = convertToDetailedAssessment(assessment);
            response.put("success", true);
            response.put("message", "Ocena została zaktualizowana");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
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
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Wystąpił błąd podczas usuwania oceny: " + e.getMessage()));
        }
    }

    /**
     * Export assessment to PDF
     * @param id Assessment ID
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return PDF file
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

        try {
            // TODO: Implement PDF export
            // For now, return a success message
            return ResponseEntity.ok(createSuccessResponse("Eksport do PDF zostanie zaimplementowany w przyszłości"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Wystąpił błąd podczas eksportu oceny: " + e.getMessage()));
        }
    }

    /**
     * Calculate progress for an assessment
     * @param assessmentId Assessment ID
     * @return Progress percentage (0-100)
     */
    private int calculateProgress(Long assessmentId) {
        Optional<Assessment> assessmentOpt = assessmentRepository.findById(assessmentId);
        if (assessmentOpt.isEmpty()) {
            return 0;
        }

        Assessment assessment = assessmentOpt.get();
        int totalRequirements = 0;
        int answeredRequirements = 0;

        for (Chapter chapter : assessment.getChapters()) {
            for (Area area : chapter.getAreas()) {
                for (Requirement requirement : area.getRequirements()) {
                    totalRequirements++;
                    if (requirement.getValue() != null && !requirement.getValue().isEmpty()) {
                        answeredRequirements++;
                    }
                }
            }
        }

        return totalRequirements > 0 ? (int) Math.round((double) answeredRequirements / totalRequirements * 100) : 0;
    }

    /**
     * Convert assessment to summary format
     * @param assessment Assessment entity
     * @return Assessment summary
     */
    private Map<String, Object> convertToAssessmentSummary(Assessment assessment) {
        Map<String, Object> result = new HashMap<>();
        result.put("id", assessment.getId());
        result.put("name", assessment.getName());
        result.put("description", assessment.getDescription());
        result.put("status", assessment.getStatus());
        result.put("progress", assessment.getProgress());
        result.put("createdAt", assessment.getCreatedAt());
        result.put("updatedAt", assessment.getUpdatedAt());
        return result;
    }

    /**
     * Convert assessment to detailed format
     * @param assessment Assessment entity
     * @return Detailed assessment
     */
    private Map<String, Object> convertToDetailedAssessment(Assessment assessment) {
        Map<String, Object> result = new HashMap<>();
        result.put("id", assessment.getId());
        result.put("name", assessment.getName());
        result.put("description", assessment.getDescription());
        result.put("status", assessment.getStatus());
        result.put("progress", assessment.getProgress());
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
                    requirementMap.put("status", requirement.getStatus());
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
     * Create error response
     * @param message Error message
     * @return Error response
     */
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }

    /**
     * Create success response
     * @param message Success message
     * @return Success response
     */
    private Map<String, Object> createSuccessResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        return response;
    }
}
