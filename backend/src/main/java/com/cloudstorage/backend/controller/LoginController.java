package com.cloudstorage.backend.controller;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cloudstorage.backend.dto.LoginRequest;
import com.cloudstorage.backend.dto.LoginResponse;
import com.cloudstorage.backend.service.CognitoService;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    // Service that handles AWS Cognito authentication
    private final CognitoService cognitoService;
    
    // Constructor - Spring automatically injects CognitoService
    public LoginController(CognitoService cognitoService) {
        this.cognitoService = cognitoService;
    }
    
    // Create login endpoint
    // POST /api/auth/login - Authenticates user and returns JWT token
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {
        String jwtToken = cognitoService.loginUser(
            loginRequest.getEmail(),
            loginRequest.getPassword()
        );
        return new LoginResponse(jwtToken);
    }
}
