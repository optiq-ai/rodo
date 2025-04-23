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

@RestController
public class AuthController {

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
            return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
        }
        
        if (passwordEncoder.matches(String.valueOf(credentialsDto.getPassword()), employee.getPassword())) {
            String token = userAuthProvider.createToken(employee.getUserName());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
    }
}
