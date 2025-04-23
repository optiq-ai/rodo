package com.auth.jwt.controller;

import com.auth.jwt.data.entity.employee.Employee;
import com.auth.jwt.data.entity.report.ComplianceArea;
import com.auth.jwt.data.entity.report.Recommendation;
import com.auth.jwt.data.entity.report.Report;
import com.auth.jwt.data.repository.ComplianceAreaRepository;
import com.auth.jwt.data.repository.RecommendationRepository;
import com.auth.jwt.data.repository.ReportRepository;
import com.auth.jwt.data.repository.employee.EmployeeJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final EmployeeJpaRepository employeeRepository;
    private final ReportRepository reportRepository;
    private final ComplianceAreaRepository complianceAreaRepository;
    private final RecommendationRepository recommendationRepository;

    @Autowired
    public ReportController(EmployeeJpaRepository employeeRepository,
                           ReportRepository reportRepository,
                           ComplianceAreaRepository complianceAreaRepository,
                           RecommendationRepository recommendationRepository) {
        this.employeeRepository = employeeRepository;
        this.reportRepository = reportRepository;
        this.complianceAreaRepository = complianceAreaRepository;
        this.recommendationRepository = recommendationRepository;
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
     * Get report data for the current user
     * @param dateRange Optional date range filter
     * @param riskCategory Optional risk category filter
     * @param riskLevel Optional risk level filter
     * @param sortBy Optional sort field
     * @return Report data
     */
    @GetMapping
    public ResponseEntity<?> getReportData(
            @RequestParam(required = false) String dateRange,
            @RequestParam(required = false) String riskCategory,
            @RequestParam(required = false) String riskLevel,
            @RequestParam(required = false) String sortBy) {
        
        Employee employee = getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        try {
            // Get reports for the current user
            List<Report> reports = reportRepository.findByEmployeeId(employee.getId());
            
            // Apply filters if provided
            List<ComplianceArea> allAreas = new ArrayList<>();
            List<Recommendation> allRecommendations = new ArrayList<>();
            
            for (Report report : reports) {
                List<ComplianceArea> areas = complianceAreaRepository.findByReportId(report.getId());
                List<Recommendation> recommendations = recommendationRepository.findByReportId(report.getId());
                
                // Apply date range filter if provided
                if (dateRange != null && !dateRange.isEmpty()) {
                    LocalDate startDate = getStartDateFromRange(dateRange);
                    areas = areas.stream()
                            .filter(area -> area.getLastUpdated().isAfter(startDate) || area.getLastUpdated().isEqual(startDate))
                            .collect(Collectors.toList());
                    
                    recommendations = recommendations.stream()
                            .filter(rec -> rec.getDueDate() != null && 
                                   (rec.getDueDate().isAfter(startDate) || rec.getDueDate().isEqual(startDate)))
                            .collect(Collectors.toList());
                }
                
                // Apply risk level filter if provided
                if (riskLevel != null && !riskLevel.isEmpty()) {
                    areas = areas.stream()
                            .filter(area -> riskLevel.equalsIgnoreCase(area.getRisk()))
                            .collect(Collectors.toList());
                }
                
                // Apply risk category filter if provided
                if (riskCategory != null && !riskCategory.isEmpty()) {
                    // This would require additional logic based on your risk categorization
                    // For now, we'll just filter by name containing the category
                    areas = areas.stream()
                            .filter(area -> area.getName().toLowerCase().contains(riskCategory.toLowerCase()))
                            .collect(Collectors.toList());
                }
                
                allAreas.addAll(areas);
                allRecommendations.addAll(recommendations);
            }
            
            // Apply sorting if provided
            if (sortBy != null && !sortBy.isEmpty()) {
                switch (sortBy.toLowerCase()) {
                    case "score":
                        allAreas.sort(Comparator.comparing(ComplianceArea::getScore).reversed());
                        break;
                    case "risk":
                        allAreas.sort(Comparator.comparing(ComplianceArea::getRisk));
                        break;
                    case "name":
                        allAreas.sort(Comparator.comparing(ComplianceArea::getName));
                        break;
                    case "date":
                        allAreas.sort(Comparator.comparing(ComplianceArea::getLastUpdated).reversed());
                        break;
                    default:
                        // Default sort by score
                        allAreas.sort(Comparator.comparing(ComplianceArea::getScore).reversed());
                }
            } else {
                // Default sort by score
                allAreas.sort(Comparator.comparing(ComplianceArea::getScore).reversed());
            }
            
            // Sort recommendations by priority
            allRecommendations.sort((r1, r2) -> {
                int p1 = getPriorityValue(r1.getPriority());
                int p2 = getPriorityValue(r2.getPriority());
                return Integer.compare(p1, p2);
            });
            
            // Build response
            Map<String, Object> response = new HashMap<>();
            
            // Compliance areas
            List<Map<String, Object>> complianceAreas = allAreas.stream()
                    .map(this::convertToComplianceAreaSummary)
                    .collect(Collectors.toList());
            response.put("complianceAreas", complianceAreas);
            
            // Risk assessment
            Map<String, Object> riskAssessment = generateRiskAssessment(allAreas);
            response.put("riskAssessment", riskAssessment);
            
            // Trends
            Map<String, Object> trends = generateTrends();
            response.put("trends", trends);
            
            // Recommendations
            List<Map<String, Object>> recommendationsList = allRecommendations.stream()
                    .map(this::convertToRecommendationSummary)
                    .collect(Collectors.toList());
            response.put("recommendations", recommendationsList);
            
            // Upcoming deadlines
            List<Map<String, Object>> upcomingDeadlines = generateUpcomingDeadlines(allRecommendations);
            response.put("upcomingDeadlines", upcomingDeadlines);
            
            // Benchmarks
            Map<String, Object> benchmarks = generateBenchmarks(allAreas);
            response.put("benchmarks", benchmarks);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Wystąpił błąd podczas pobierania danych raportu: " + e.getMessage()));
        }
    }

    /**
     * Get details of a specific compliance area
     * @param id Area ID
     * @return Area details
     */
    @GetMapping("/areas/{id}")
    public ResponseEntity<?> getAreaDetails(@PathVariable Long id) {
        Employee employee = getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        try {
            Optional<ComplianceArea> areaOpt = complianceAreaRepository.findById(id);
            if (areaOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Obszar o podanym ID nie istnieje"));
            }
            
            ComplianceArea area = areaOpt.get();
            
            // Check if area belongs to current user
            if (!area.getReport().getEmployee().getId().equals(employee.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createErrorResponse("Brak dostępu do tego obszaru"));
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", area.getId());
            response.put("name", area.getName());
            response.put("description", "Szczegółowy opis obszaru " + area.getName());
            response.put("score", area.getScore());
            response.put("risk", area.getRisk());
            response.put("lastUpdated", area.getLastUpdated());
            
            // Requirements
            List<Map<String, Object>> requirements = new ArrayList<>();
            for (int i = 1; i <= 5; i++) {
                Map<String, Object> req = new HashMap<>();
                req.put("id", i);
                req.put("text", "Wymaganie " + i + " dla obszaru " + area.getName());
                req.put("status", getRandomStatus());
                req.put("comment", "Komentarz do wymagania " + i);
                requirements.add(req);
            }
            response.put("requirements", requirements);
            
            // Progress history
            List<Map<String, Object>> progressHistory = new ArrayList<>();
            LocalDate date = LocalDate.now();
            int score = area.getScore();
            for (int i = 0; i < 6; i++) {
                Map<String, Object> progress = new HashMap<>();
                progress.put("date", date.minusMonths(i));
                progress.put("score", Math.max(0, score - (i * 10)));
                progressHistory.add(progress);
            }
            response.put("progressHistory", progressHistory);
            
            // Recommendations
            List<Map<String, Object>> recommendations = new ArrayList<>();
            String[] priorities = {"wysoki", "średni", "niski"};
            String[] statuses = {"nowy", "w trakcie", "zakończony"};
            for (int i = 1; i <= 3; i++) {
                Map<String, Object> rec = new HashMap<>();
                rec.put("id", i);
                rec.put("text", "Rekomendacja " + i + " dla obszaru " + area.getName());
                rec.put("priority", priorities[i % 3]);
                rec.put("status", statuses[i % 3]);
                recommendations.add(rec);
            }
            response.put("recommendations", recommendations);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Wystąpił błąd podczas pobierania szczegółów obszaru: " + e.getMessage()));
        }
    }

    /**
     * Export report to specified format
     * @param format Export format (pdf, xlsx)
     * @return Export file
     */
    @GetMapping("/export")
    public ResponseEntity<?> exportReport(@RequestParam String format) {
        Employee employee = getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        try {
            // In a real implementation, this would generate the actual file
            // For now, we'll just return a success message
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Raport został wyeksportowany do formatu " + format);
            response.put("fileName", "raport_rodo_" + LocalDate.now() + "." + format);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Wystąpił błąd podczas eksportu raportu: " + e.getMessage()));
        }
    }

    /**
     * Convert ComplianceArea to summary format
     * @param area ComplianceArea entity
     * @return ComplianceArea summary
     */
    private Map<String, Object> convertToComplianceAreaSummary(ComplianceArea area) {
        Map<String, Object> result = new HashMap<>();
        result.put("id", area.getId());
        result.put("name", area.getName());
        result.put("score", area.getScore());
        result.put("risk", area.getRisk());
        return result;
    }

    /**
     * Convert Recommendation to summary format
     * @param recommendation Recommendation entity
     * @return Recommendation summary
     */
    private Map<String, Object> convertToRecommendationSummary(Recommendation recommendation) {
        Map<String, Object> result = new HashMap<>();
        result.put("id", recommendation.getId());
        result.put("area", "Obszar związany z " + recommendation.getText().substring(0, Math.min(20, recommendation.getText().length())));
        result.put("action", recommendation.getText());
        result.put("priority", recommendation.getPriority());
        result.put("estimatedTime", getEstimatedTime(recommendation.getPriority()));
        result.put("estimatedCost", getEstimatedCost(recommendation.getPriority()));
        return result;
    }

    /**
     * Generate risk assessment data
     * @param areas List of compliance areas
     * @return Risk assessment data
     */
    private Map<String, Object> generateRiskAssessment(List<ComplianceArea> areas) {
        Map<String, Object> result = new HashMap<>();
        
        // Before mitigation
        List<Integer> beforeMitigation = new ArrayList<>();
        // After mitigation
        List<Integer> afterMitigation = new ArrayList<>();
        
        for (ComplianceArea area : areas) {
            int riskScore = 100 - area.getScore();
            beforeMitigation.add(riskScore);
            
            // After mitigation is typically lower
            afterMitigation.add(Math.max(0, riskScore - 30));
        }
        
        result.put("beforeMitigation", beforeMitigation);
        result.put("afterMitigation", afterMitigation);
        
        return result;
    }

    /**
     * Generate trends data
     * @return Trends data
     */
    private Map<String, Object> generateTrends() {
        Map<String, Object> result = new HashMap<>();
        
        // Generate last 6 months
        List<String> labels = new ArrayList<>();
        List<Integer> data = new ArrayList<>();
        
        LocalDate date = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");
        
        for (int i = 5; i >= 0; i--) {
            LocalDate monthDate = date.minusMonths(i);
            labels.add(monthDate.format(formatter));
            
            // Generate random compliance score with upward trend
            int baseScore = 60 + (i * 5);
            int randomVariation = new Random().nextInt(10) - 5; // -5 to +4
            data.add(Math.min(100, Math.max(0, baseScore + randomVariation)));
        }
        
        result.put("labels", labels);
        result.put("data", data);
        
        return result;
    }

    /**
     * Generate upcoming deadlines
     * @param recommendations List of recommendations
     * @return Upcoming deadlines
     */
    private List<Map<String, Object>> generateUpcomingDeadlines(List<Recommendation> recommendations) {
        List<Map<String, Object>> result = new ArrayList<>();
        
        LocalDate today = LocalDate.now();
        
        for (Recommendation recommendation : recommendations) {
            if (recommendation.getDueDate() != null && 
                recommendation.getDueDate().isAfter(today) && 
                !recommendation.getStatus().equalsIgnoreCase("completed")) {
                
                Map<String, Object> deadline = new HashMap<>();
                deadline.put("id", recommendation.getId());
                deadline.put("task", recommendation.getText());
                deadline.put("deadline", recommendation.getDueDate());
                
                long daysLeft = java.time.temporal.ChronoUnit.DAYS.between(today, recommendation.getDueDate());
                deadline.put("daysLeft", daysLeft);
                
                result.add(deadline);
            }
        }
        
        // If no real deadlines, generate some sample ones
        if (result.isEmpty()) {
            for (int i = 1; i <= 3; i++) {
                Map<String, Object> deadline = new HashMap<>();
                deadline.put("id", i);
                deadline.put("task", "Zadanie " + i + " do wykonania");
                
                LocalDate dueDate = today.plusDays(i * 7);
                deadline.put("deadline", dueDate);
                
                long daysLeft = java.time.temporal.ChronoUnit.DAYS.between(today, dueDate);
                deadline.put("daysLeft", daysLeft);
                
                result.add(deadline);
            }
        }
        
        // Sort by days left
        result.sort(Comparator.comparing(d -> (Long) d.get("daysLeft")));
        
        return result;
    }

    /**
     * Generate benchmarks data
     * @param areas List of compliance areas
     * @return Benchmarks data
     */
    private Map<String, Object> generateBenchmarks(List<ComplianceArea> areas) {
        Map<String, Object> result = new HashMap<>();
        
        // Calculate average score
        double averageScore = areas.stream()
                .mapToInt(ComplianceArea::getScore)
                .average()
                .orElse(0);
        
        // Industry average is typically a bit lower
        double industryAverage = Math.max(0, averageScore - 10);
        
        // Top performer is typically higher
        double topPerformer = Math.min(100, averageScore + 15);
        
        result.put("industry", Math.round(industryAverage * 10) / 10.0);
        result.put("yourScore", Math.round(averageScore * 10) / 10.0);
        result.put("topPerformer", Math.round(topPerformer * 10) / 10.0);
        
        return result;
    }

    /**
     * Get start date from date range string
     * @param dateRange Date range string
     * @return Start date
     */
    private LocalDate getStartDateFromRange(String dateRange) {
        LocalDate today = LocalDate.now();
        
        switch (dateRange.toLowerCase()) {
            case "past_week":
                return today.minusWeeks(1);
            case "past_month":
                return today.minusMonths(1);
            case "past_quarter":
                return today.minusMonths(3);
            case "past_year":
                return today.minusYears(1);
            default:
                return today.minusYears(100); // All time
        }
    }

    /**
     * Get priority value for sorting
     * @param priority Priority string
     * @return Priority value
     */
    private int getPriorityValue(String priority) {
        if (priority == null) return 3;
        
        switch (priority.toLowerCase()) {
            case "high":
            case "wysoki":
                return 1;
            case "medium":
            case "średni":
                return 2;
            case "low":
            case "niski":
                return 3;
            default:
                return 3;
        }
    }

    /**
     * Get random status for requirements
     * @return Random status
     */
    private String getRandomStatus() {
        String[] statuses = {"zgodny", "częściowo zgodny", "niezgodny"};
        return statuses[new Random().nextInt(statuses.length)];
    }

    /**
     * Get estimated time based on priority
     * @param priority Priority string
     * @return Estimated time
     */
    private String getEstimatedTime(String priority) {
        if (priority == null) return "2-4 tygodnie";
        
        switch (priority.toLowerCase()) {
            case "high":
            case "wysoki":
                return "1-2 tygodnie";
            case "medium":
            case "średni":
                return "2-4 tygodnie";
            case "low":
            case "niski":
                return "1-3 miesiące";
            default:
                return "2-4 tygodnie";
        }
    }

    /**
     * Get estimated cost based on priority
     * @param priority Priority string
     * @return Estimated cost
     */
    private String getEstimatedCost(String priority) {
        if (priority == null) return "5000-10000 PLN";
        
        switch (priority.toLowerCase()) {
            case "high":
            case "wysoki":
                return "10000-20000 PLN";
            case "medium":
            case "średni":
                return "5000-10000 PLN";
            case "low":
            case "niski":
                return "1000-5000 PLN";
            default:
                return "5000-10000 PLN";
        }
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
