package com.auth.jwt.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String[] PERMITTED_PATHS = {"/login", "/register", "/swagger-ui", "/v3/api-docs", "/swagger-resources"};

    private final UserAuthProvider userAuthProvider;

    public JwtAuthFilter(UserAuthProvider userAuthProvider) {
        this.userAuthProvider = userAuthProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getServletPath();
        
        // Skip filter for permitted paths
        if (Arrays.stream(PERMITTED_PATHS).anyMatch(path::startsWith)) {
            System.out.println("Skipping filter for permitted path: " + path);
            filterChain.doFilter(request, response);
            return;
        }
        
        System.out.println("Processing request: " + request.getMethod() + " " + request.getRequestURI() + "?" + request.getQueryString());
        
        // Check Authorization header
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        System.out.println("Authorization Header: " + header);
        
        String token = null;
        
        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
            System.out.println("Token from header: " + token);
        } else {
            // If token not in header, check request parameter
            token = request.getParameter("token");
            System.out.println("Token from parameter: " + token);
        }
        
        if (token != null) {
            try {
                System.out.println("Attempting to validate token: " + token);
                var authentication = userAuthProvider.validateToken(token);
                if (authentication != null) {
                    ((AbstractAuthenticationToken) authentication)
                            .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("Token is valid, user authenticated: " + authentication.getName());
                } else {
                    System.out.println("Token validation returned null authentication");
                    SecurityContextHolder.clearContext();
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Nieautoryzowany dostęp");
                    return;
                }
            } catch (RuntimeException e) {
                System.out.println("Token validation failed: " + e.getMessage());
                e.printStackTrace();
                SecurityContextHolder.clearContext();
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Nieautoryzowany dostęp");
                return;
            }
        } else {
            // No token found in either header or parameter
            System.out.println("No token found in either header or parameter");
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Wymagane uwierzytelnienie");
            return;
        }
        
        filterChain.doFilter(request, response);
    }
}
