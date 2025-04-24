package com.auth.jwt.controller;

import com.auth.jwt.data.entity.employee.Employee;
import com.auth.jwt.data.entity.subscription.Subscription;
import com.auth.jwt.data.repository.SubscriptionRepository;
import com.auth.jwt.data.repository.employee.EmployeeJpaRepository;
import com.auth.jwt.security.UserAuthProviderParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/subscriptions")
public class SubscriptionController {

    private final EmployeeJpaRepository employeeRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final UserAuthProviderParam userAuthProviderParam;

    @Autowired
    public SubscriptionController(EmployeeJpaRepository employeeRepository,
                                 SubscriptionRepository subscriptionRepository,
                                 UserAuthProviderParam userAuthProviderParam) {
        this.employeeRepository = employeeRepository;
        this.subscriptionRepository = subscriptionRepository;
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
     * Get subscription data for the current user
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return Subscription data
     */
    @GetMapping
    public ResponseEntity<?> getSubscription(@RequestParam(required = false) String token) {
        // Use security context that was set by JwtAuthFilter
        Employee employee = getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        try {
            Optional<Subscription> subscriptionOpt = subscriptionRepository.findByEmployeeId(employee.getId());
            
            if (subscriptionOpt.isPresent()) {
                Subscription subscription = subscriptionOpt.get();
                Map<String, Object> response = new HashMap<>();
                response.put("plan", subscription.getPlan());
                response.put("status", subscription.getStatus());
                response.put("nextBillingDate", subscription.getNextBillingDate());
                response.put("paymentMethod", subscription.getPaymentMethod());
                
                return ResponseEntity.ok(response);
            } else {
                // Create a default subscription for new users
                Subscription subscription = new Subscription(
                    "basic",
                    "active",
                    LocalDate.now().plusMonths(1),
                    "card",
                    employee
                );
                subscriptionRepository.save(subscription);
                
                Map<String, Object> response = new HashMap<>();
                response.put("plan", subscription.getPlan());
                response.put("status", subscription.getStatus());
                response.put("nextBillingDate", subscription.getNextBillingDate());
                response.put("paymentMethod", subscription.getPaymentMethod());
                
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Wystąpił błąd podczas pobierania danych subskrypcji: " + e.getMessage()));
        }
    }

    /**
     * Change subscription plan
     * @param planData Plan data
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return Updated subscription data
     */
    @PutMapping("/plan")
    public ResponseEntity<?> changePlan(@RequestBody Map<String, String> planData, 
                                       @RequestParam(required = false) String token) {
        // Use security context that was set by JwtAuthFilter
        Employee employee = getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        try {
            String newPlan = planData.get("plan");
            if (newPlan == null || newPlan.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Plan subskrypcji jest wymagany"));
            }
            
            if (!newPlan.equals("basic") && !newPlan.equals("premium")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Nieprawidłowy plan subskrypcji. Dozwolone wartości: basic, premium"));
            }
            
            Optional<Subscription> subscriptionOpt = subscriptionRepository.findByEmployeeId(employee.getId());
            Subscription subscription;
            
            if (subscriptionOpt.isPresent()) {
                subscription = subscriptionOpt.get();
                
                // If plan is the same, just return success
                if (subscription.getPlan().equals(newPlan)) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("message", "Plan subskrypcji nie został zmieniony (wybrany ten sam plan)");
                    response.put("plan", subscription.getPlan());
                    response.put("nextBillingDate", subscription.getNextBillingDate());
                    
                    return ResponseEntity.ok(response);
                }
                
                // Update plan
                subscription.setPlan(newPlan);
                subscription.setStatus("active");
                subscription.setNextBillingDate(LocalDate.now().plusMonths(1));
            } else {
                // Create new subscription
                subscription = new Subscription(
                    newPlan,
                    "active",
                    LocalDate.now().plusMonths(1),
                    "card",
                    employee
                );
            }
            
            subscriptionRepository.save(subscription);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Plan subskrypcji został zmieniony na " + newPlan);
            response.put("plan", subscription.getPlan());
            response.put("nextBillingDate", subscription.getNextBillingDate());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Wystąpił błąd podczas zmiany planu subskrypcji: " + e.getMessage()));
        }
    }

    /**
     * Cancel subscription
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return Cancellation confirmation
     */
    @PutMapping("/cancel")
    public ResponseEntity<?> cancelSubscription(@RequestParam(required = false) String token) {
        // Use security context that was set by JwtAuthFilter
        Employee employee = getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        try {
            Optional<Subscription> subscriptionOpt = subscriptionRepository.findByEmployeeId(employee.getId());
            
            if (subscriptionOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Nie znaleziono aktywnej subskrypcji"));
            }
            
            Subscription subscription = subscriptionOpt.get();
            
            // If already canceled, just return success
            if (subscription.getStatus().equals("canceled")) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Subskrypcja jest już anulowana");
                response.put("validUntil", subscription.getNextBillingDate());
                
                return ResponseEntity.ok(response);
            }
            
            // Cancel subscription
            subscription.setStatus("canceled");
            subscriptionRepository.save(subscription);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Subskrypcja została anulowana");
            response.put("validUntil", subscription.getNextBillingDate());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Wystąpił błąd podczas anulowania subskrypcji: " + e.getMessage()));
        }
    }

    /**
     * Get available subscription plans
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return List of available plans
     */
    @GetMapping("/plans")
    public ResponseEntity<?> getAvailablePlans(@RequestParam(required = false) String token) {
        // Use security context that was set by JwtAuthFilter
        Employee employee = getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        try {
            List<Map<String, Object>> plans = new ArrayList<>();
            
            // Basic plan
            Map<String, Object> basicPlan = new HashMap<>();
            basicPlan.put("id", "basic");
            basicPlan.put("name", "Plan Podstawowy");
            basicPlan.put("price", 99);
            basicPlan.put("currency", "PLN");
            basicPlan.put("period", "month");
            
            List<String> basicFeatures = new ArrayList<>();
            basicFeatures.add("Dostęp do podstawowych ocen RODO");
            basicFeatures.add("Maksymalnie 3 oceny");
            basicFeatures.add("Podstawowe raporty");
            basicFeatures.add("Wsparcie e-mail");
            basicPlan.put("features", basicFeatures);
            plans.add(basicPlan);
            
            // Premium plan
            Map<String, Object> premiumPlan = new HashMap<>();
            premiumPlan.put("id", "premium");
            premiumPlan.put("name", "Plan Premium");
            premiumPlan.put("price", 299);
            premiumPlan.put("currency", "PLN");
            premiumPlan.put("period", "month");
            
            List<String> premiumFeatures = new ArrayList<>();
            premiumFeatures.add("Dostęp do wszystkich ocen RODO");
            premiumFeatures.add("Nieograniczona liczba ocen");
            premiumFeatures.add("Zaawansowane raporty i analizy");
            premiumFeatures.add("Eksport do różnych formatów");
            premiumFeatures.add("Priorytetowe wsparcie 24/7");
            premiumFeatures.add("Dedykowany opiekun klienta");
            premiumPlan.put("features", premiumFeatures);
            plans.add(premiumPlan);
            
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Wystąpił błąd podczas pobierania dostępnych planów: " + e.getMessage()));
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
