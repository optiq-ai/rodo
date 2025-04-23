package com.auth.jwt.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth.jwt.data.entity.employee.Employee;
import com.auth.jwt.data.repository.employee.EmployeeJpaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserAuthProvider {

    private final String secretKey;
    private final EmployeeJpaRepository employeeRepository;

    public UserAuthProvider(@Value("${security.jwt.token.secret.key}") String secretKey, 
                           EmployeeJpaRepository employeeRepository) {
        this.secretKey = secretKey;
        this.employeeRepository = employeeRepository;
    }

    public String createToken(String username) {
        // Set token expiration time, for example, 10 hours
        long expirationTime = 10 * 60 * 60 * 1000;
        return JWT.create()
                .withIssuer(username)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + expirationTime))
                .sign(Algorithm.HMAC256(secretKey));
    }

    public Authentication validateToken(String token) {
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secretKey)).build();
        DecodedJWT decoded = verifier.verify(token);
        Employee user = employeeRepository.findByLogin(decoded.getIssuer());
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());
        return new UsernamePasswordAuthenticationToken(user, null, authorities);
    }
}
