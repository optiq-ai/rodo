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

    private static final String[] PERMITTED_PATHS = {"/login", "/register"};

    private final UserAuthProvider userAuthProvider;

    public JwtAuthFilter(UserAuthProvider userAuthProvider) {
        this.userAuthProvider = userAuthProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getServletPath();
        
        // Skip filter for permitted paths
        if (Arrays.stream(PERMITTED_PATHS).anyMatch(path::startsWith)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Check Authorization header
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        String token = null;
        
        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
        } else {
            // If token not in header, check request parameter
            token = request.getParameter("token");
        }
        
        if (token != null) {
            try {
                var authentication = userAuthProvider.validateToken(token);
                if (authentication != null) {
                    ((AbstractAuthenticationToken) authentication)
                            .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("Token is valid");
                }
            } catch (RuntimeException e) {
                System.out.println("Token validation failed: " + e.getMessage());
                SecurityContextHolder.clearContext();
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Nieautoryzowany dostęp");
                return;
            }
        } else {
            // No token found in either header or parameter
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Wymagane uwierzytelnienie");
            return;
        }
        
        filterChain.doFilter(request, response);
    }
}
