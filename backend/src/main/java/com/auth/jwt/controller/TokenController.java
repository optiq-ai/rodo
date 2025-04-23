package com.auth.jwt.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/verify-token")
public class TokenController {

    /**
     * Verify JWT token
     * @return Token verification result
     */
    @GetMapping
    public ResponseEntity<?> verifyToken() {
        // The token is already verified by the security filter
        // If we reach this point, the token is valid
        
        // In a real implementation, we would extract user details from the token
        // For now, we'll just return a success response
        Map<String, Object> response = new HashMap<>();
        response.put("valid", true);
        response.put("username", "current_user"); // This would be extracted from the token
        response.put("email", "user@example.com"); // This would be extracted from the token
        response.put("role", "USER"); // This would be extracted from the token
        
        return ResponseEntity.ok(response);
    }
}
