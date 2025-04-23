package com.auth.jwt.controller;

import com.auth.jwt.data.dto.authorization.RegisterDto;
import com.auth.jwt.data.entity.employee.Employee;
import com.auth.jwt.data.entity.employee.Role;
import com.auth.jwt.data.repository.employee.EmployeeJpaRepository;
import com.auth.jwt.data.repository.employee.RoleJpaRepository;
import com.auth.jwt.security.UserAuthProvider;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
public class RegistrationController {
    
    private final EmployeeJpaRepository employeeRepository;
    private final RoleJpaRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserAuthProvider userAuthProvider;
    
    // Email validation pattern
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);
    
    // Password validation pattern (at least one uppercase letter and one special character)
    private static final Pattern PASSWORD_PATTERN = 
        Pattern.compile("^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,}$");
    
    public RegistrationController(EmployeeJpaRepository employeeRepository,
                                 RoleJpaRepository roleRepository,
                                 PasswordEncoder passwordEncoder,
                                 UserAuthProvider userAuthProvider) {
        this.employeeRepository = employeeRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.userAuthProvider = userAuthProvider;
    }
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterDto registerDto) {
        Map<String, String> response = new HashMap<>();
        
        // Validate email format
        if (!EMAIL_PATTERN.matcher(registerDto.getEmail()).matches()) {
            response.put("error", "Invalid email format");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Validate password requirements
        if (!PASSWORD_PATTERN.matcher(String.valueOf(registerDto.getPassword())).matches()) {
            response.put("error", "Password must contain at least one uppercase letter and one special character");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Check if username already exists
        if (employeeRepository.findByUserName(registerDto.getUserName()) != null) {
            response.put("error", "Username already exists");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Check if email already exists
        if (employeeRepository.findByEmail(registerDto.getEmail()) != null) {
            response.put("error", "Email already exists");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            // Create new employee
            Employee employee = new Employee();
            employee.setUserName(registerDto.getUserName());
            employee.setPassword(passwordEncoder.encode(String.valueOf(registerDto.getPassword())));
            employee.setFirstName(registerDto.getFirstName());
            employee.setLastName(registerDto.getLastName());
            employee.setEmail(registerDto.getEmail());
            
            // Assign admin role
            Role adminRole = roleRepository.findByName("ROLE_ADMIN");
            if (adminRole == null) {
                adminRole = new Role("ROLE_ADMIN");
                roleRepository.save(adminRole);
            }
            
            List<Role> roles = new ArrayList<>();
            roles.add(adminRole);
            employee.setRoles(roles);
            
            // Save employee
            employeeRepository.save(employee);
            
            // Generate token
            String token = userAuthProvider.createToken(employee.getUserName());
            
            // Return success response with token
            response.put("token", token);
            response.put("message", "Registration successful");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
