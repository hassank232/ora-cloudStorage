package com.cloudstorage.backend.service;

import org.springframework.stereotype.Service;
import com.cloudstorage.backend.entity.User;
import com.cloudstorage.backend.repository.UserRepository;

// Business logic layer for User operations
@Service
public class UserService {
    
    // Dependencies injected by Spring
    private final UserRepository userRepository;
    private final CognitoService cognitoService;

    // Constructor injection - Spring automatically provides these dependencies
    public UserService(UserRepository userRepository, CognitoService cognitoService) {
        this.userRepository = userRepository;
        this.cognitoService = cognitoService;
    }

    // Creates a new user account in both AWS Cognito and local database
    // password User's password (sent to Cognito, not stored locally)
    // @return Created User entity with generated ID and Cognito connection
    public User registerUser(String email, String username, String password, String phoneNumber) {
        
        if(userRepository.existsByEmail(email)){
            throw new RuntimeException("Email already exists, choose another");
        }
        
        // Create user in AWS Cognito first - this handles password security
        String cognitoUserId = cognitoService.registerUser(email, password, username);

        // Create local database record linked to Cognito account
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setUsername(username);
        newUser.setCognitoUserId(cognitoUserId); // This links AWS Cognito to our database
        newUser.setPhoneNumber(phoneNumber);

        // Save to PostgreSQL database
        userRepository.save(newUser);

        return newUser;
    }

    // (personal note to self)
    // lowkey not needed since jwt contains username also
    // and you got confused when it returned hk to second user also

    // Find user in database using their AWS Cognito ID
    // Used after login to get user's database record from their JWT token
    // cognitoUserId The Cognito user ID from JWT token
    public User getUserByCognitoId(String cognitoUserId) {
        return userRepository.findByCognitoUserId(cognitoUserId);
    }
    
}
