package com.cloudstorage.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import com.cloudstorage.backend.entity.User;
import com.cloudstorage.backend.repository.UserRepository;
import com.cloudstorage.backend.service.CognitoService;
import com.cloudstorage.backend.dto.RegisterRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

// UserControllerIntegrationTest - Full integration test with real database
// Tests complete flow: HTTP request → Controller → Service → Database
// Mocks only external services (AWS Cognito) to avoid real API calls
@SpringBootTest
@Transactional // Rolls back database changes after test
@AutoConfigureMockMvc
public class UserControllerIntegrationTest {

    // Simulates HTTP requests
    @Autowired
    private MockMvc mockMvc;

    // Real database repository
    @Autowired
    private UserRepository userRepository;

    // Mock CognitoService to avoid real AWS API calls in integration tests
    @MockBean
    private CognitoService mockCognitoService;

    // Converts objects to/from JSON
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testRegisterUser_FullIntegration() throws Exception {
    
        // Arrange - Create registration request for integration test
        RegisterRequest inputRequest = new RegisterRequest();
        inputRequest.setEmail("integrationtest@example.com");
        inputRequest.setUsername("testintegrationuser");
        inputRequest.setPassword("password123");
        inputRequest.setPhoneNumber("1234567891");

        // Arrange - Mock Cognito service to avoid real AWS API calls
        when(mockCognitoService.registerUser(
            inputRequest.getEmail(), 
            inputRequest.getPassword(), 
            inputRequest.getUsername())).thenReturn("integration-cognito-user-123");

        // Act - Send HTTP POST request through full application stack
        String jsonRequest = objectMapper.writeValueAsString(inputRequest);
        ResultActions result = mockMvc.perform(
            post("/api/users/register")
            .with(csrf()) // Add this line
            .contentType(MediaType.APPLICATION_JSON)
            .content(jsonRequest)
        );

        // Assert - Verify HTTP response matches expected format
        result.andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("integrationtest@example.com"))
            .andExpect(jsonPath("$.username").value("testintegrationuser"))
            .andExpect(jsonPath("$.cognitoUserId").value("integration-cognito-user-123"))
            .andExpect(jsonPath("$.phoneNumber").value("1234567891"));

        // Assert - Verify data was actually persisted to database
        // (this is what makes it an integration test!)
        User savedUser = userRepository.findByEmail("integrationtest@example.com");
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getUsername()).isEqualTo("testintegrationuser");
        assertThat(savedUser.getCognitoUserId()).isEqualTo("integration-cognito-user-123");
        assertThat(savedUser.getPhoneNumber()).isEqualTo("1234567891");
        assertThat(savedUser.getId()).isNotNull(); // Database generated ID
    }

}
