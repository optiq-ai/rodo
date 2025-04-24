package com.auth.jwt.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth.jwt.data.entity.employee.Employee;
import com.auth.jwt.data.repository.employee.EmployeeJpaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserAuthProviderParam {

    private static final Logger logger = LoggerFactory.getLogger(UserAuthProviderParam.class);
    private final String secretKey;
    private final EmployeeJpaRepository employeeRepository;

    public UserAuthProviderParam(@Value("${security.jwt.token.secret.key}") String secretKey, 
                           EmployeeJpaRepository employeeRepository) {
        this.secretKey = secretKey;
        this.employeeRepository = employeeRepository;
    }

    public Authentication validateToken(String token) {
        try {
            logger.debug("Walidacja tokenu JWT z parametru");
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secretKey)).build();
            DecodedJWT decoded = verifier.verify(token);
            
            String username = decoded.getIssuer();
            logger.debug("Token zawiera nazwę użytkownika: {}", username);
            
            Employee user = employeeRepository.findByUserName(username);
            if (user == null) {
                logger.error("Użytkownik z tokenu nie znaleziony w bazie danych: {}", username);
                throw new RuntimeException("User not found");
            }
            
            List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                    .map(role -> new SimpleGrantedAuthority(role.getName()))
                    .collect(Collectors.toList());
            
            logger.debug("Token zwalidowany pomyślnie dla użytkownika: {}", username);
            return new UsernamePasswordAuthenticationToken(user, null, authorities);
        } catch (JWTVerificationException e) {
            logger.error("Błąd walidacji tokenu JWT z parametru: {}", e.getMessage());
            throw new RuntimeException("Invalid token", e);
        }
    }
}
