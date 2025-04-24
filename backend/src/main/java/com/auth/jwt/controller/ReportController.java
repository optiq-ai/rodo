package com.auth.jwt.controller;

import com.auth.jwt.data.entity.employee.Employee;
import com.auth.jwt.data.entity.report.ComplianceArea;
import com.auth.jwt.data.entity.report.Recommendation;
import com.auth.jwt.data.entity.report.Report;
import com.auth.jwt.data.repository.ComplianceAreaRepository;
import com.auth.jwt.data.repository.RecommendationRepository;
import com.auth.jwt.data.repository.ReportRepository;
import com.auth.jwt.data.repository.employee.EmployeeJpaRepository;
import com.auth.jwt.security.UserAuthProviderParam;
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
    private final UserAuthProviderParam userAuthProviderParam;

    @Autowired
    public ReportController(EmployeeJpaRepository employeeRepository,
                           ReportRepository reportRepository,
                           ComplianceAreaRepository complianceAreaRepository,
                           RecommendationRepository recommendationRepository,
                           UserAuthProviderParam userAuthProviderParam) {
        this.employeeRepository = employeeRepository;
        this.reportRepository = reportRepository;
        this.complianceAreaRepository = complianceAreaRepository;
        this.recommendationRepository = recommendationRepository;
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
     * Get report data for the current user
     * @param dateRange Optional date range filter
     * @param riskCategory Optional risk category filter
     * @param riskLevel Optional risk level filter
     * @param sortBy Optional sort field
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return Report data
     */
    @GetMapping
    public ResponseEntity<?> getReportData(
            @RequestParam(required = false) String dateRange,
            @RequestParam(required = false) String riskCategory,
            @RequestParam(required = false) String riskLevel,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String token) {
        
        // Use security context that was set by JwtAuthFilter
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
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return Area details
     */
    @GetMapping("/areas/{id}")
    public ResponseEntity<?> getAreaDetails(@PathVariable Long id, @RequestParam(required = false) String token) {
        // Use security context that was set by JwtAuthFilter
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
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return Export file
     */
    @GetMapping("/export")
    public ResponseEntity<?> exportReport(@RequestParam String format, @RequestParam(required = false) String token) {
        // Use security context that was set by JwtAuthFilter
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

    // Helper methods (getStartDateFromRange, getPriorityValue, getRandomStatus, etc.)
    // These would be implemented based on your specific requirements

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

    // Other helper methods would be implemented here
    private LocalDate getStartDateFromRange(String dateRange) {
        // Implementation would go here
        return LocalDate.now().minusMonths(1);
    }

    private int getPriorityValue(String priority) {
        // Implementation would go here
        return 1;
    }

    private String getRandomStatus() {
        // Implementation would go here
        return "zgodny";
    }

    private Map<String, Object> convertToComplianceAreaSummary(ComplianceArea area) {
        Map<String, Object> result = new HashMap<>();
        result.put("id", area.getId());
        result.put("name", area.getName());
        result.put("score", area.getScore());
        result.put("risk", area.getRisk());
        result.put("lastUpdated", area.getLastUpdated());
        return result;
    }

    private Map<String, Object> convertToRecommendationSummary(Recommendation recommendation) {
        Map<String, Object> result = new HashMap<>();
        result.put("id", recommendation.getId());
        result.put("text", recommendation.getText());
        result.put("priority", recommendation.getPriority());
        result.put("status", recommendation.getStatus());
        result.put("dueDate", recommendation.getDueDate());
        result.put("estimatedTime", getEstimatedTime(recommendation.getPriority()));
        result.put("estimatedCost", getEstimatedCost(recommendation.getPriority()));
        return result;
    }

    private String getEstimatedTime(String priority) {
        // Implementation would go here
        return "2-4 tygodnie";
    }

    private String getEstimatedCost(String priority) {
        // Implementation would go here
        return "5000-10000 PLN";
    }

    private Map<String, Object> generateRiskAssessment(List<ComplianceArea> areas) {
        Map<String, Object> result = new HashMap<>();
        
        // Count areas by risk level
        int highRisk = 0;
        int mediumRisk = 0;
        int lowRisk = 0;
        
        for (ComplianceArea area : areas) {
            switch (area.getRisk().toLowerCase()) {
                case "wysoki":
                    highRisk++;
                    break;
                case "średni":
                    mediumRisk++;
                    break;
                case "niski":
                    lowRisk++;
                    break;
            }
        }
        
        result.put("highRisk", highRisk);
        result.put("mediumRisk", mediumRisk);
        result.put("lowRisk", lowRisk);
        
        // Overall risk score (0-100)
        int totalAreas = highRisk + mediumRisk + lowRisk;
        int riskScore = totalAreas > 0 
            ? (highRisk * 100 + mediumRisk * 50 + lowRisk * 10) / totalAreas 
            : 0;
        result.put("overallRiskScore", riskScore);
        
        // Risk categories
        List<Map<String, Object>> riskCategories = new ArrayList<>();
        String[] categories = {"Dane osobowe", "Bezpieczeństwo IT", "Procesy biznesowe", "Dokumentacja", "Szkolenia"};
        Random random = new Random();
        
        for (String category : categories) {
            Map<String, Object> cat = new HashMap<>();
            cat.put("name", category);
            cat.put("score", 50 + random.nextInt(50)); // Random score between 50-100
            riskCategories.add(cat);
        }
        result.put("riskCategories", riskCategories);
        
        return result;
    }

    private Map<String, Object> generateTrends() {
        Map<String, Object> result = new HashMap<>();
        
        // Compliance score trend
        List<Map<String, Object>> complianceScoreTrend = new ArrayList<>();
        LocalDate date = LocalDate.now();
        int score = 75;
        Random random = new Random();
        
        for (int i = 5; i >= 0; i--) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", date.minusMonths(i));
            point.put("score", Math.min(100, Math.max(0, score + random.nextInt(10) - 5)));
            complianceScoreTrend.add(point);
            score = (int) point.get("score");
        }
        result.put("complianceScoreTrend", complianceScoreTrend);
        
        // Risk level trend
        List<Map<String, Object>> riskLevelTrend = new ArrayList<>();
        int highRisk = 5;
        int mediumRisk = 8;
        int lowRisk = 12;
        
        for (int i = 5; i >= 0; i--) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", date.minusMonths(i));
            point.put("highRisk", Math.max(0, highRisk - i/2));
            point.put("mediumRisk", Math.max(0, mediumRisk - i/3));
            point.put("lowRisk", Math.max(0, lowRisk - i/4));
            riskLevelTrend.add(point);
        }
        result.put("riskLevelTrend", riskLevelTrend);
        
        return result;
    }

    private List<Map<String, Object>> generateUpcomingDeadlines(List<Recommendation> recommendations) {
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        // Filter recommendations with due dates in the next 30 days
        List<Recommendation> upcomingRecommendations = recommendations.stream()
                .filter(rec -> rec.getDueDate() != null && 
                       rec.getDueDate().isAfter(today) && 
                       rec.getDueDate().isBefore(today.plusDays(30)))
                .collect(Collectors.toList());
        
        // Sort by due date
        upcomingRecommendations.sort(Comparator.comparing(Recommendation::getDueDate));
        
        // Convert to response format
        for (Recommendation rec : upcomingRecommendations) {
            Map<String, Object> deadline = new HashMap<>();
            deadline.put("id", rec.getId());
            deadline.put("text", rec.getText());
            deadline.put("dueDate", rec.getDueDate());
            deadline.put("priority", rec.getPriority());
            deadline.put("daysRemaining", today.until(rec.getDueDate()).getDays());
            result.add(deadline);
        }
        
        return result;
    }

    private Map<String, Object> generateBenchmarks(List<ComplianceArea> areas) {
        Map<String, Object> result = new HashMap<>();
        
        // Calculate average score
        double avgScore = areas.stream()
                .mapToInt(ComplianceArea::getScore)
                .average()
                .orElse(0);
        
        result.put("yourScore", avgScore);
        result.put("industryAverage", 65.0);
        result.put("topPerformers", 85.0);
        
        // Benchmark by category
        List<Map<String, Object>> categoryBenchmarks = new ArrayList<>();
        String[] categories = {"Dane osobowe", "Bezpieczeństwo IT", "Procesy biznesowe", "Dokumentacja", "Szkolenia"};
        Random random = new Random();
        
        for (String category : categories) {
            Map<String, Object> cat = new HashMap<>();
            cat.put("name", category);
            cat.put("yourScore", 50 + random.nextInt(50));
            cat.put("industryAverage", 50 + random.nextInt(30));
            cat.put("topPerformers", 80 + random.nextInt(20));
            categoryBenchmarks.add(cat);
        }
        result.put("categories", categoryBenchmarks);
        
        return result;
    }
}
