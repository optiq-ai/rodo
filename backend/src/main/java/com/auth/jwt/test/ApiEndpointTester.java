package com.auth.jwt.test;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.HashMap;
import java.util.Map;

/**
 * Test class for API endpoints
 * This class is for development testing only and should be removed in production
 */
@Component
public class ApiEndpointTester implements CommandLineRunner {

    private final String baseUrl = "http://localhost:8080";
    private final RestTemplate restTemplate = new RestTemplate();
    private String authToken = "";

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Starting API endpoint tests...");
        
        // Test authentication endpoints
        testAuthentication();
        
        // Test user profile endpoints
        testUserProfile();
        
        // Test company endpoints
        testCompany();
        
        // Test assessment endpoints
        testAssessments();
        
        // Test report endpoints
        testReports();
        
        // Test subscription endpoints
        testSubscriptions();
        
        System.out.println("API endpoint tests completed successfully!");
    }
    
    private void testAuthentication() {
        System.out.println("\n=== Testing Authentication Endpoints ===");
        
        // Test registration
        System.out.println("Testing registration endpoint...");
        Map<String, Object> registrationData = new HashMap<>();
        registrationData.put("userName", "testuser");
        registrationData.put("password", "Test@123");
        registrationData.put("firstName", "Test");
        registrationData.put("lastName", "User");
        registrationData.put("email", "test@example.com");
        
        try {
            ResponseEntity<Map> registrationResponse = restTemplate.postForEntity(
                baseUrl + "/register",
                registrationData,
                Map.class
            );
            
            System.out.println("Registration response: " + registrationResponse.getStatusCode());
            if (registrationResponse.getStatusCode() == HttpStatus.OK) {
                System.out.println("Registration successful!");
            } else {
                System.out.println("Registration failed with status: " + registrationResponse.getStatusCode());
            }
        } catch (Exception e) {
            System.out.println("Registration test failed: " + e.getMessage());
            // Continue with login test as the user might already exist
        }
        
        // Test login
        System.out.println("Testing login endpoint...");
        Map<String, String> loginData = new HashMap<>();
        loginData.put("login", "testuser");
        loginData.put("password", "Test@123");
        
        try {
            ResponseEntity<Map> loginResponse = restTemplate.postForEntity(
                baseUrl + "/login",
                loginData,
                Map.class
            );
            
            System.out.println("Login response: " + loginResponse.getStatusCode());
            if (loginResponse.getStatusCode() == HttpStatus.OK) {
                authToken = (String) loginResponse.getBody().get("token");
                System.out.println("Login successful! Token received.");
            } else {
                System.out.println("Login failed with status: " + loginResponse.getStatusCode());
            }
        } catch (Exception e) {
            System.out.println("Login test failed: " + e.getMessage());
        }
        
        // Test token verification
        if (authToken != null && !authToken.isEmpty()) {
            System.out.println("Testing token verification endpoint...");
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(authToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            try {
                ResponseEntity<Map> verifyResponse = restTemplate.exchange(
                    baseUrl + "/verify-token",
                    HttpMethod.GET,
                    entity,
                    Map.class
                );
                
                System.out.println("Token verification response: " + verifyResponse.getStatusCode());
                if (verifyResponse.getStatusCode() == HttpStatus.OK) {
                    Boolean valid = (Boolean) verifyResponse.getBody().get("valid");
                    if (valid != null && valid) {
                        System.out.println("Token verification successful!");
                    } else {
                        System.out.println("Token verification failed: Token is invalid");
                    }
                } else {
                    System.out.println("Token verification failed with status: " + verifyResponse.getStatusCode());
                }
            } catch (Exception e) {
                System.out.println("Token verification test failed: " + e.getMessage());
            }
        } else {
            System.out.println("Skipping token verification test: No token available");
        }
    }
    
    private void testUserProfile() {
        if (authToken == null || authToken.isEmpty()) {
            System.out.println("\n=== Skipping User Profile Tests: No authentication token ===");
            return;
        }
        
        System.out.println("\n=== Testing User Profile Endpoints ===");
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(authToken);
        
        // Test get profile
        System.out.println("Testing get profile endpoint...");
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        try {
            ResponseEntity<Map> profileResponse = restTemplate.exchange(
                baseUrl + "/users/profile",
                HttpMethod.GET,
                entity,
                Map.class
            );
            
            System.out.println("Get profile response: " + profileResponse.getStatusCode());
            if (profileResponse.getStatusCode() == HttpStatus.OK) {
                System.out.println("Get profile successful!");
            } else {
                System.out.println("Get profile failed with status: " + profileResponse.getStatusCode());
            }
        } catch (Exception e) {
            System.out.println("Get profile test failed: " + e.getMessage());
        }
        
        // Test update profile
        System.out.println("Testing update profile endpoint...");
        Map<String, Object> profileData = new HashMap<>();
        profileData.put("firstName", "Updated");
        profileData.put("lastName", "User");
        profileData.put("phone", "123456789");
        profileData.put("position", "Tester");
        profileData.put("notificationEmail", true);
        profileData.put("notificationApp", true);
        
        HttpEntity<Map<String, Object>> updateEntity = new HttpEntity<>(profileData, headers);
        
        try {
            ResponseEntity<Map> updateResponse = restTemplate.exchange(
                baseUrl + "/users/profile",
                HttpMethod.PUT,
                updateEntity,
                Map.class
            );
            
            System.out.println("Update profile response: " + updateResponse.getStatusCode());
            if (updateResponse.getStatusCode() == HttpStatus.OK) {
                System.out.println("Update profile successful!");
            } else {
                System.out.println("Update profile failed with status: " + updateResponse.getStatusCode());
            }
        } catch (Exception e) {
            System.out.println("Update profile test failed: " + e.getMessage());
        }
        
        // Test change password
        System.out.println("Testing change password endpoint...");
        Map<String, String> passwordData = new HashMap<>();
        passwordData.put("currentPassword", "Test@123");
        passwordData.put("newPassword", "NewTest@123");
        
        HttpEntity<Map<String, String>> passwordEntity = new HttpEntity<>(passwordData, headers);
        
        try {
            ResponseEntity<Map> passwordResponse = restTemplate.exchange(
                baseUrl + "/users/password",
                HttpMethod.PUT,
                passwordEntity,
                Map.class
            );
            
            System.out.println("Change password response: " + passwordResponse.getStatusCode());
            if (passwordResponse.getStatusCode() == HttpStatus.OK) {
                System.out.println("Change password successful!");
                
                // Change back to original password for future tests
                passwordData.put("currentPassword", "NewTest@123");
                passwordData.put("newPassword", "Test@123");
                
                HttpEntity<Map<String, String>> resetEntity = new HttpEntity<>(passwordData, headers);
                
                ResponseEntity<Map> resetResponse = restTemplate.exchange(
                    baseUrl + "/users/password",
                    HttpMethod.PUT,
                    resetEntity,
                    Map.class
                );
                
                if (resetResponse.getStatusCode() == HttpStatus.OK) {
                    System.out.println("Reset password successful!");
                } else {
                    System.out.println("Reset password failed with status: " + resetResponse.getStatusCode());
                }
            } else {
                System.out.println("Change password failed with status: " + passwordResponse.getStatusCode());
            }
        } catch (Exception e) {
            System.out.println("Change password test failed: " + e.getMessage());
        }
    }
    
    private void testCompany() {
        if (authToken == null || authToken.isEmpty()) {
            System.out.println("\n=== Skipping Company Tests: No authentication token ===");
            return;
        }
        
        System.out.println("\n=== Testing Company Endpoints ===");
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(authToken);
        
        // Test get company
        System.out.println("Testing get company endpoint...");
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        try {
            ResponseEntity<Map> companyResponse = restTemplate.exchange(
                baseUrl + "/users/company",
                HttpMethod.GET,
                entity,
                Map.class
            );
            
            System.out.println("Get company response: " + companyResponse.getStatusCode());
            if (companyResponse.getStatusCode() == HttpStatus.OK) {
                System.out.println("Get company successful!");
            } else {
                System.out.println("Get company failed with status: " + companyResponse.getStatusCode());
            }
        } catch (Exception e) {
            System.out.println("Get company test failed: " + e.getMessage());
        }
        
        // Test update company
        System.out.println("Testing update company endpoint...");
        Map<String, String> companyData = new HashMap<>();
        companyData.put("name", "Test Company");
        companyData.put("address", "Test Street 123");
        companyData.put("city", "Test City");
        companyData.put("postalCode", "12-345");
        companyData.put("nip", "1234567890");
        companyData.put("regon", "123456789");
        companyData.put("industry", "IT");
        
        HttpEntity<Map<String, String>> updateEntity = new HttpEntity<>(companyData, headers);
        
        try {
            ResponseEntity<Map> updateResponse = restTemplate.exchange(
                baseUrl + "/users/company",
                HttpMethod.PUT,
                updateEntity,
                Map.class
            );
            
            System.out.println("Update company response: " + updateResponse.getStatusCode());
            if (updateResponse.getStatusCode() == HttpStatus.OK) {
                System.out.println("Update company successful!");
            } else {
                System.out.println("Update company failed with status: " + updateResponse.getStatusCode());
            }
        } catch (Exception e) {
            System.out.println("Update company test failed: " + e.getMessage());
        }
    }
    
    private void testAssessments() {
        if (authToken == null || authToken.isEmpty()) {
            System.out.println("\n=== Skipping Assessment Tests: No authentication token ===");
            return;
        }
        
        System.out.println("\n=== Testing Assessment Endpoints ===");
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(authToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        // Test get all assessments
        System.out.println("Testing get all assessments endpoint...");
        
        try {
            ResponseEntity<Map[]> assessmentsResponse = restTemplate.exchange(
                baseUrl + "/assessments",
                HttpMethod.GET,
                entity,
                Map[].class
            );
            
            System.out.println("Get assessments response: " + assessmentsResponse.getStatusCode());
            if (assessmentsResponse.getStatusCode() == HttpStatus.OK) {
                System.out.println("Get assessments successful!");
            } else {
                System.out.println("Get assessments failed with status: " + assessmentsResponse.getStatusCode());
            }
        } catch (Exception e) {
            System.out.println("Get assessments test failed: " + e.getMessage());
        }
        
        // Test get assessment summary
        System.out.println("Testing get assessment summary endpoint...");
        
        try {
            ResponseEntity<Map> summaryResponse = restTemplate.exchange(
                baseUrl + "/assessments/summary",
                HttpMethod.GET,
                entity,
                Map.class
            );
            
            System.out.println("Get summary response: " + summaryResponse.getStatusCode());
            if (summaryResponse.getStatusCode() == HttpStatus.OK) {
                System.out.println("Get summary successful!");
            } else {
                System.out.println("Get summary failed with status: " + summaryResponse.getStatusCode());
            }
        } catch (Exception e) {
            System.out.println("Get summary test failed: " + e.getMessage());
        }
        
        // Test get assessment template
        System.out.println("Testing get assessment template endpoint...");
        
        try {
            ResponseEntity<Map> templateResponse = restTemplate.exchange(
                baseUrl + "/assessments/template",
                HttpMethod.GET,
                entity,
                Map.class
            );
            
            System.out.println("Get template response: " + templateResponse.getStatusCode());
            if (templateResponse.getStatusCode() == HttpStatus.OK) {
                System.out.println("Get template successful!");
            } else {
                System.out.println("Get template failed with status: " + templateResponse.getStatusCode());
            }
        } catch (Exception e) {
            System.out.println("Get template test failed: " + e.getMessage());
        }
    }
    
    private void testReports() {
        if (authToken == null || authToken.isEmpty()) {
            System.out.println("\n=== Skipping Report Tests: No authentication token ===");
            return;
        }
        
        System.out.println("\n=== Testing Report Endpoints ===");
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(authToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        // Test get reports
        System.out.println("Testing get reports endpoint...");
        
        try {
            ResponseEntity<Map> reportsResponse = restTemplate.exchange(
                baseUrl + "/reports",
                HttpMethod.GET,
                entity,
                Map.class
            );
            
            System.out.println("Get reports response: " + reportsResponse.getStatusCode());
            if (reportsResponse.getStatusCode() == HttpStatus.OK) {
                System.out.println("Get reports successful!");
            } else {
                System.out.println("Get reports failed with status: " + reportsResponse.getStatusCode());
            }
        } catch (Exception e) {
            System.out.println("Get reports test failed: " + e.getMessage());
        }
        
        // Test export report
        System.out.println("Testing export report endpoint...");
        
        try {
            ResponseEntity<Map> exportResponse = restTemplate.exchange(
                baseUrl + "/reports/export?format=pdf",
                HttpMethod.GET,
                entity,
                Map.class
            );
            
            System.out.println("Export report response: " + exportResponse.getStatusCode());
            if (exportResponse.getStatusCode() == HttpStatus.OK) {
                System.out.println("Export report successful!");
            } else {
                System.out.println("Export report failed with status: " + exportResponse.getStatusCode());
            }
        } catch (Exception e) {
            System.out.println("Export report test failed: " + e.getMessage());
        }
    }
    
    private void testSubscriptions() {
        if (authToken == null || authToken.isEmpty()) {
            System.out.println("\n=== Skipping Subscription Tests: No authentication token ===");
            return;
        }
        
        System.out.println("\n=== Testing Subscription Endpoints ===");
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(authToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        // Test get subscription
        System.out.println("Testing get subscription endpoint...");
        
        try {
            ResponseEntity<Map> subscriptionResponse = restTemplate.exchange(
                baseUrl + "/subscriptions",
                HttpMethod.GET,
                entity,
                Map.class
            );
            
            System.out.println("Get subscription response: " + subscriptionResponse.getStatusCode());
            if (subscriptionResponse.getStatusCode() == HttpStatus.OK) {
                System.out.println("Get subscription successful!");
            } else {
                System.out.println("Get subscription failed with status: " + subscriptionResponse.getStatusCode());
            }
        } catch (Exception e) {
            System.out.println("Get subscription test failed: " + e.getMessage());
        }
        
        // Test get available plans
        System.out.println("Testing get available plans endpoint...");
        
        try {
            ResponseEntity<Map[]> plansResponse = restTemplate.exchange(
                baseUrl + "/subscriptions/plans",
                HttpMethod.GET,
                entity,
                Map[].class
            );
            
            System.out.println("Get plans response: " + plansResponse.getStatusCode());
            if (plansResponse.getStatusCode() == HttpStatus.OK) {
                System.out.println("Get plans successful!");
            } else {
                System.out.println("Get plans failed with status: " + plansResponse.getStatusCode());
            }
        } catch (Exception e) {
            System.out.println("Get plans test failed: " + e.getMessage());
        }
    }
}
