package com.auth.jwt.controller;

import com.auth.jwt.data.dto.authorization.CredentialsDto;
import com.auth.jwt.data.entity.employee.Employee;
import com.auth.jwt.data.repository.employee.EmployeeJpaRepository;
import com.auth.jwt.security.UserAuthProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final EmployeeJpaRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserAuthProvider userAuthProvider;

    public AuthController(EmployeeJpaRepository employeeRepository, 
                         PasswordEncoder passwordEncoder,
                         UserAuthProvider userAuthProvider) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.userAuthProvider = userAuthProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody CredentialsDto credentialsDto) {
        logger.info("Próba logowania dla użytkownika: {}", credentialsDto.getUserName());
        
        // Sprawdzenie czy dane logowania są puste
        if (credentialsDto.getUserName() == null || credentialsDto.getUserName().isEmpty() || 
            credentialsDto.getPassword() == null || credentialsDto.getPassword().length == 0) {
            logger.warn("Próba logowania z pustymi danymi");
            return ResponseEntity.status(401).body(Map.of("message", "Username and password are required"));
        }
        
        // Używamy getUserName zamiast getLogin dla spójności
        Employee employee = employeeRepository.findByUserName(credentialsDto.getUserName());
        
        if (employee == null) {
            logger.warn("Użytkownik nie znaleziony: {}", credentialsDto.getUserName());
            return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
        }
        
        // Konwertujemy tablicę znaków na String
        String passwordFromRequest = new String(credentialsDto.getPassword());
        
        // Sprawdzamy, czy hasło pasuje
        boolean passwordMatches = passwordEncoder.matches(passwordFromRequest, employee.getPassword());
        logger.debug("Czy hasło pasuje: {}", passwordMatches);
        
        if (passwordMatches) {
            String token = userAuthProvider.createToken(employee.getUserName());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", employee.getUserName());
            response.put("email", employee.getEmail());
            
            // Dodajemy role użytkownika, jeśli są dostępne
            if (employee.getRoles() != null && !employee.getRoles().isEmpty()) {
                response.put("role", employee.getRoles().get(0).getName());
            }
            
            logger.info("Logowanie udane dla użytkownika: {}", employee.getUserName());
            return ResponseEntity.ok(response);
        }
        
        logger.warn("Niepoprawne hasło dla użytkownika: {}", employee.getUserName());
        return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
    }
    
    @PostMapping("/verify-token")
    public ResponseEntity<Map<String, Object>> verifyToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        logger.info("Próba weryfikacji tokenu");
        
        if (token == null || token.isEmpty()) {
            logger.warn("Próba weryfikacji pustego tokenu");
            return ResponseEntity.status(401).body(Map.of("valid", false, "message", "Token is required"));
        }
        
        try {
            var authentication = userAuthProvider.validateToken(token);
            if (authentication != null && authentication.getPrincipal() instanceof Employee) {
                Employee employee = (Employee) authentication.getPrincipal();
                
                Map<String, Object> response = new HashMap<>();
                response.put("valid", true);
                response.put("username", employee.getUserName());
                response.put("email", employee.getEmail());
                
                // Dodajemy role użytkownika, jeśli są dostępne
                if (employee.getRoles() != null && !employee.getRoles().isEmpty()) {
                    response.put("role", employee.getRoles().get(0).getName());
                }
                
                logger.info("Token zweryfikowany pomyślnie dla użytkownika: {}", employee.getUserName());
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            logger.error("Błąd weryfikacji tokenu: {}", e.getMessage());
        }
        
        logger.warn("Weryfikacja tokenu nieudana");
        return ResponseEntity.status(401).body(Map.of("valid", false, "message", "Invalid token"));
    }
}
