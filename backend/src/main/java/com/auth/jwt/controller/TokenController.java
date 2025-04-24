package com.auth.jwt.controller;

import com.auth.jwt.data.entity.employee.Employee;
import com.auth.jwt.data.repository.employee.EmployeeJpaRepository;
import com.auth.jwt.security.UserAuthProviderParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Iterator;

@RestController
@RequestMapping("/verify-token")
public class TokenController {

    private final UserAuthProviderParam userAuthProviderParam;
    private final EmployeeJpaRepository employeeRepository;

    @Autowired
    public TokenController(UserAuthProviderParam userAuthProviderParam, EmployeeJpaRepository employeeRepository) {
        this.userAuthProviderParam = userAuthProviderParam;
        this.employeeRepository = employeeRepository;
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
     * Verify JWT token
     * @param token JWT token (optional, not used directly as authentication is handled by JwtAuthFilter)
     * @return Token verification result
     */
    @GetMapping
    public ResponseEntity<?> verifyToken(@RequestParam(required = false) String token) {
        // Use security context that was set by JwtAuthFilter
        Employee employee = getCurrentUser();
        
        if (employee != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("username", employee.getUserName());
            response.put("email", employee.getEmail());
            
            // Extract role information if available
            String role = "USER";
            if (employee.getRoles() != null && !employee.getRoles().isEmpty()) {
                // Use iterator to get the first role instead of indexed access
                Iterator<?> iterator = employee.getRoles().iterator();
                if (iterator.hasNext()) {
                    Object roleObj = iterator.next();
                    if (roleObj instanceof com.auth.jwt.data.entity.employee.Role) {
                        role = ((com.auth.jwt.data.entity.employee.Role) roleObj).getName();
                    }
                }
            }
            response.put("role", role);
            
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("message", "Invalid token");
            return ResponseEntity.ok(response);
        }
    }
}
