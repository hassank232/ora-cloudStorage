package com.cloudstorage.backend.controller;

import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.anonymous;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


import com.cloudstorage.backend.entity.User;
import com.cloudstorage.backend.service.UserService;
import com.cloudstorage.backend.dto.RegisterRequest;
import com.fasterxml.jackson.databind.ObjectMapper;


// UserControllerTest - Tests UserController HTTP endpoints with mocked service layer
// Uses MockMvc to simulate HTTP requests and verify JSON responses
@WebMvcTest(value = UserController.class, excludeAutoConfiguration = {SecurityAutoConfiguration.class})  // Disable security for this test
public class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;  // Simulates HTTP requests
    
    // Mocked service layer
    @MockBean  
    private UserService mockUserService;
    
    // Converts objects to/from JSON
    @Autowired
    private ObjectMapper objectMapper;

    // No @InjectMocks needed - Spring handles injection

    @Test
    public void testRegisterUser_SuccessfulRegistration() throws Exception {
    
        // Arrange - Create registration request data
        RegisterRequest inputRequest = new RegisterRequest();
        inputRequest.setEmail("test@example.com");
        inputRequest.setUsername("testuser");
        inputRequest.setPassword("password123");
        inputRequest.setPhoneNumber("1234567890");
    
        // Arrange - Configure mock service to return successful user
        User savedUser = new User(); 
        savedUser.setId(1L); 
        savedUser.setEmail("test@example.com"); 
        savedUser.setUsername("testuser");
        savedUser.setCognitoUserId("cognito-user-12345");  
        savedUser.setPhoneNumber("1234567890");

        when(mockUserService.registerUser(
            inputRequest.getEmail(), 
            inputRequest.getUsername(), 
            inputRequest.getPassword(), 
            inputRequest.getPhoneNumber())).thenReturn(savedUser);
    
        // Act - Simulate HTTP POST request
        // Send HTTP POST request with JSON body
        String jsonRequest = objectMapper.writeValueAsString(inputRequest);

        ResultActions result = mockMvc.perform(
            post("/api/users/register")
            .with(csrf()) // Add this line
            .with(anonymous())  // Add this line
            .contentType(MediaType.APPLICATION_JSON)
            .content(jsonRequest)
        );

    // Assert - Verify HTTP response status and JSON content
    result.andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1L))
        .andExpect(jsonPath("$.email").value("test@example.com"))
        .andExpect(jsonPath("$.username").value("testuser"))
        .andExpect(jsonPath("$.cognitoUserId").value("cognito-user-12345"))
        .andExpect(jsonPath("$.phoneNumber").value("1234567890"));
}

@Test
    public void testRegisterUser_EmailAlreadyExists() throws Exception {

        // Arrange - Create registration request with duplicate email
        RegisterRequest inputRequest = new RegisterRequest();
        inputRequest.setEmail("test@example.com");
        inputRequest.setUsername("testuser");
        inputRequest.setPassword("password123");
        inputRequest.setPhoneNumber("1234567890");

        // Arrange - Configure mock service to throw exception
        when(mockUserService.registerUser(
            inputRequest.getEmail(), 
            inputRequest.getUsername(), 
            inputRequest.getPassword(), 
            inputRequest.getPhoneNumber())).thenThrow(new RuntimeException("Email already exists, choose another"));
    
        // Act - Send HTTP POST request with duplicate email
        String jsonRequest = objectMapper.writeValueAsString(inputRequest);
        ResultActions result = mockMvc.perform(
            post("/api/users/register")
            .with(csrf()) 
            .with(anonymous())  
            .contentType(MediaType.APPLICATION_JSON)
            .content(jsonRequest)
        );
    
        // Assert - Verify proper error response from exception handler
        result.andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("Email already exists, choose another"));
    }

}
