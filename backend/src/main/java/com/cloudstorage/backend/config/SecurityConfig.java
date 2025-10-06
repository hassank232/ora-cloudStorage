package com.cloudstorage.backend.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

// SecurityConfig - Spring Security configuration for JWT-based authentication
// Configures CORS, session management, and JWT validation with AWS Cognito.
// Sets up stateless authentication where each request must include a valid JWT token.
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Password encoder for hashing passwords (used for testing/fallback scenarios)
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Main security configuration - sets up authentication and authorization rules
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // CORS configuration - allows React frontend to call backend API
            .cors(cors -> cors.configurationSource(request -> {
                // Create CORS configuration inline
                CorsConfiguration config = new CorsConfiguration();
                
                // Allow React dev server to make requests
                config.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
                
                // Allow standard HTTP methods from frontend
                config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                
                // Allow all headers (includes Authorization header for JWT)
                config.setAllowedHeaders(Arrays.asList("*"));
                
                // Allow credentials for Authorization (needed for Authorization header with JWT)
                config.setAllowCredentials(true);
                
                return config;
            }))

            // Stateless session - no server-side sessions, JWT tokens only
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Authorization rules - which endpoints require authentication
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/users/register").permitAll()  // Public endpoints
                .anyRequest().authenticated()   // All other endpoints require valid JWT
            )

            // JWT validation with AWS Cognito
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwkSetUri("https://cognito-idp.us-east-2.amazonaws.com/us-east-2_fr4Bt2AHt/.well-known/jwks.json"))
            )

            // Disable CSRF for REST APIs (JWT tokens used instead of cookies)
            .csrf(csrf -> csrf.disable());
            
        return http.build();
    }
    
}