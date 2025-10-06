package com.cloudstorage.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import com.cloudstorage.backend.entity.User;
import com.cloudstorage.backend.repository.UserRepository;

// UserServiceTest - Tests UserService business logic with mocked dependencies
// Uses Mockito to isolate the service layer from database and external services
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    
    // Mock dependencies - fake objects we control
    @Mock
    private UserRepository mockUserRepository;
    @Mock
    private CognitoService mockCognitoService;
    
    // Real service with mocked dependencies injected
    @InjectMocks
    private UserService userService;

    @Test
    public void testRegisterUser_Success() {

        // Arrange - Set up test data
        String email = "test@example.com";        
        String username = "testuser";
        String password = "password123";
        String phoneNumber = "1234567890";
        String mockCognitoUserId = "cognito-user-12345";
        
        // Arrange - Configure mock behavior for success scenario (what should they return?)
        //when(/* what mock object? */./* what method? */(/* what parameter? */)).thenReturn(/* what result? */);
        when(mockUserRepository.existsByEmail(email)).thenReturn(false);
        // - Mock cognitoService.registerUser() to return a cognito user ID
        when(mockCognitoService.registerUser(email, password, username)).thenReturn(mockCognitoUserId);
        
        // Act - Call the method we're testing
        User result = userService.registerUser(email, username, password, phoneNumber);
        
        // Assert - Verify the returned User object
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(email);
        assertThat(result.getUsername()).isEqualTo(username);
        assertThat(result.getCognitoUserId()).isEqualTo(mockCognitoUserId);
        assertThat(result.getPhoneNumber()).isEqualTo(phoneNumber);
        
        // Assert - Verify repository save was called
        //verify(/* what mock? */)./* what method? */(/* what parameter? */);
        verify(mockUserRepository).save(result);
    }
        @Test
        public void testRegisterUser_EmailAlreadyExists() {

        // Arrange - Set up test data
        String email = "test@example.com";        
        String username = "testuser";
        String password = "password123";
        String phoneNumber = "1234567890";
        
        // Arrange - Configure mock for failure scenario (email exists)
        when(mockUserRepository.existsByEmail(email)).thenReturn(true);
        
        // Act & Assert - Expect exception to be thrown
        assertThatThrownBy(() -> {
            userService.registerUser(email, username, password, phoneNumber);
            }).isInstanceOf(RuntimeException.class)
            .hasMessage("Email already exists, choose another");
        
        // Assert - Verify only email check was called (save should not happen)
        verify(mockUserRepository).existsByEmail(email);
}       
    @Test
    public void testRegisterUser_CognitoIntegrationVerification() {

        // Arrange - Set up test data
        String email = "test@example.com";       
        String username = "testuser";
        String password = "password123";
        String phoneNumber = "1234567890";
        String mockCognitoUserId = "cognito-user-67890";
        
        // Arrange - Configure mocks for success scenario
        when(mockUserRepository.existsByEmail(email)).thenReturn(false);
        when(mockCognitoService.registerUser(email, password, username)).thenReturn(mockCognitoUserId);
        
        // Act - Call the method we're testing
        User result = userService.registerUser(email, username, password, phoneNumber);

        
        // Assert - Verify Cognito integration worked correctly
        assertThat(result.getCognitoUserId()).isEqualTo(mockCognitoUserId);
        assertThat(result.getCognitoUserId()).isNotNull().isNotEmpty();
        
        // Assert - Verify correct service interactions
        verify(mockCognitoService, times(1)).registerUser(email, password, username);
        verify(mockUserRepository).existsByEmail(email);
    }   
    
}
