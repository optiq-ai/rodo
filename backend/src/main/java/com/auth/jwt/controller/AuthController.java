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
        Employee employee = employeeRepository.findByLogin(credentialsDto.getLogin());
        
        if (employee == null) {
            logger.debug("Użytkownik nie znaleziony: {}", credentialsDto.getLogin());
            return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
        }
        
        // Dodajemy debugowanie, aby sprawdzić, co otrzymujemy z frontendu
        String passwordFromRequest = new String(credentialsDto.getPassword());
        logger.debug("Hasło z żądania: {}", passwordFromRequest);
        
        // Sprawdzamy, czy hasło pasuje
        boolean passwordMatches = passwordEncoder.matches(passwordFromRequest, employee.getPassword());
        logger.debug("Czy hasło pasuje: {}", passwordMatches);
        
        if (passwordMatches) {
            String token = userAuthProvider.createToken(employee.getUserName());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            logger.debug("Logowanie udane dla użytkownika: {}", employee.getUserName());
            return ResponseEntity.ok(response);
        }
        
        logger.debug("Niepoprawne hasło dla użytkownika: {}", employee.getUserName());
        return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
    }
}
