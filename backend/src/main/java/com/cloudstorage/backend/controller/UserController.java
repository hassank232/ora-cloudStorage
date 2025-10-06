package com.cloudstorage.backend.controller;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import com.cloudstorage.backend.entity.User;
import com.cloudstorage.backend.service.UserService;
import com.cloudstorage.backend.dto.RegisterRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;

import org.springframework.web.bind.annotation.RequestMapping;  
import org.springframework.web.bind.annotation.RequestBody;     
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

// Handles HTTP requests for user-related operations
@RestController
@RequestMapping("/api/users")
public class UserController {

    // Business logic layer - injected by Spring
    @Autowired
    private UserService userService;
    
    // Creates a new user account
    // @param request Contains email, username, password, phoneNumber from frontend JSON
    // @return Created User entity (Spring converts to JSON automatically)
    @PostMapping("/register")
    public User registerUser(@RequestBody RegisterRequest request) {

        // Delegate business logic to service layer
        User savedUser = userService.registerUser(
            request.getEmail(), 
            request.getUsername(),
            request.getPassword(),
            request.getPhoneNumber());
        
        return savedUser;        
    }

    // (personal note to self)
    // lowkey not needed since jwt contains username also
    // and you got confused when it returned hk to second user also

    // Gets current user's information from their JWT token

    // @param authentication JWT token data injected by Spring Security
    // @return Current user's database record
    @GetMapping("/me")
    public User getCurrentUser(Authentication authentication) {

        // Extract Cognito user ID from JWT token
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String cognitoUserId = jwt.getSubject();
        
        // Get user's database record using their Cognito ID
        return userService.getUserByCognitoId(cognitoUserId);
    }

    // Handles errors thrown by service layer (like "email already exists")
    // Converts Java exceptions into proper HTTP error responses

    // @param ex The RuntimeException thrown by UserService
    // @return HTTP 400 Bad Request with error message
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                             .body("{\"error\":\"Email already exists, choose another\"}");
    }
    
}
