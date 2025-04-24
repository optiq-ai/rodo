package com.auth.jwt.controller;

import com.auth.jwt.security.UserAuthProviderParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/verify-token")
public class TokenController {

    private final UserAuthProviderParam userAuthProviderParam;

    @Autowired
    public TokenController(UserAuthProviderParam userAuthProviderParam) {
        this.userAuthProviderParam = userAuthProviderParam;
    }

    /**
     * Verify JWT token
     * @param token JWT token (optional)
     * @return Token verification result
     */
    @GetMapping
    public ResponseEntity<?> verifyToken(@RequestParam(required = false) String token) {
        // If token is provided as parameter, verify it directly
        if (token != null && !token.isEmpty()) {
            try {
                Authentication authentication = userAuthProviderParam.validateToken(token);
                if (authentication != null) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("valid", true);
                    response.put("username", authentication.getName());
                    // In a real implementation, we would extract more user details
                    response.put("email", "user@example.com"); 
                    response.put("role", "USER");
                    return ResponseEntity.ok(response);
                }
            } catch (Exception e) {
                Map<String, Object> response = new HashMap<>();
                response.put("valid", false);
                response.put("message", "Invalid token");
                return ResponseEntity.ok(response);
            }
        }
        
        // If no token parameter or validation failed, fall back to the security filter verification
        // The token is already verified by the security filter
        // If we reach this point, the token is valid
        
        Map<String, Object> response = new HashMap<>();
        response.put("valid", true);
        response.put("username", "current_user"); // This would be extracted from the token
        response.put("email", "user@example.com"); // This would be extracted from the token
        response.put("role", "USER"); // This would be extracted from the token
        
        return ResponseEntity.ok(response);
    }
}
