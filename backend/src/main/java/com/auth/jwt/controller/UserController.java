package com.auth.jwt.controller;

import com.auth.jwt.data.dto.profile.PasswordChangeDto;
import com.auth.jwt.data.dto.profile.UserProfileDto;
import com.auth.jwt.data.entity.employee.Employee;
import com.auth.jwt.data.entity.profile.UserProfile;
import com.auth.jwt.data.repository.UserProfileRepository;
import com.auth.jwt.data.repository.employee.EmployeeJpaRepository;
import com.auth.jwt.security.UserAuthProviderParam;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    private final EmployeeJpaRepository employeeRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserAuthProviderParam userAuthProviderParam;

    @Autowired
    public UserController(EmployeeJpaRepository employeeRepository, 
                          UserProfileRepository userProfileRepository,
                          PasswordEncoder passwordEncoder,
                          UserAuthProviderParam userAuthProviderParam) {
        this.employeeRepository = employeeRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
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
     * Get user profile information
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return ResponseEntity with user profile data
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestParam(required = false) String token) {
        // Use security context that was set by JwtAuthFilter
        Employee employee = getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        Optional<UserProfile> userProfileOpt = userProfileRepository.findByEmployeeId(employee.getId());
        UserProfile userProfile = userProfileOpt.orElse(new UserProfile());

        Map<String, Object> response = new HashMap<>();
        response.put("username", employee.getUserName());
        response.put("email", employee.getEmail());
        response.put("firstName", employee.getFirstName());
        response.put("lastName", employee.getLastName());
        response.put("phone", userProfile.getPhone());
        response.put("position", userProfile.getPosition());
        response.put("notifications", userProfile.getNotificationEmail());

        return ResponseEntity.ok(response);
    }

    /**
     * Update user profile information
     * @param profileDto User profile data to update
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return ResponseEntity with success or error message
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@Valid @RequestBody UserProfileDto profileDto, 
                                              @RequestParam(required = false) String token) {
        // Use security context that was set by JwtAuthFilter
        Employee employee = getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        try {
            // Update employee data
            employee.setFirstName(profileDto.getFirstName());
            employee.setLastName(profileDto.getLastName());
            employeeRepository.save(employee);

            // Update or create user profile
            Optional<UserProfile> userProfileOpt = userProfileRepository.findByEmployeeId(employee.getId());
            UserProfile userProfile;
            
            if (userProfileOpt.isPresent()) {
                userProfile = userProfileOpt.get();
                userProfile.setPhone(profileDto.getPhone());
                userProfile.setPosition(profileDto.getPosition());
                userProfile.setNotificationEmail(profileDto.getNotificationEmail());
                userProfile.setNotificationApp(profileDto.getNotificationApp());
            } else {
                userProfile = new UserProfile(
                    profileDto.getPhone(),
                    profileDto.getPosition(),
                    profileDto.getNotificationEmail(),
                    profileDto.getNotificationApp(),
                    employee
                );
            }
            
            userProfileRepository.save(userProfile);

            return ResponseEntity.ok(createSuccessResponse("Profil został zaktualizowany"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Wystąpił błąd podczas aktualizacji profilu: " + e.getMessage()));
        }
    }

    /**
     * Change user password
     * @param passwordChangeDto Password change data
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return ResponseEntity with success or error message
     */
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody PasswordChangeDto passwordChangeDto,
                                           @RequestParam(required = false) String token) {
        // Use security context that was set by JwtAuthFilter
        Employee employee = getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        // Verify current password
        if (!passwordEncoder.matches(passwordChangeDto.getCurrentPassword(), employee.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("Aktualne hasło jest nieprawidłowe"));
        }

        try {
            // Update password
            employee.setPassword(passwordEncoder.encode(passwordChangeDto.getNewPassword()));
            employeeRepository.save(employee);

            return ResponseEntity.ok(createSuccessResponse("Hasło zostało zmienione"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Wystąpił błąd podczas zmiany hasła: " + e.getMessage()));
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
