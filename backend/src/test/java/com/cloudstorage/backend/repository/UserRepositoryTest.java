package com.cloudstorage.backend.repository ;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import com.cloudstorage.backend.entity.User;
import static org.assertj.core.api.Assertions.assertThat;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

// UserRepositoryTest - Tests the User repository's database operations
// Tests custom finder methods and basic CRUD operations with test data
@SpringBootTest
@Transactional // Rolls back database changes after each test
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testSaveAndFindUser() {

        // Arrange - Create test data
        User testUser = new User();
        testUser.setUsername("testuser123");
        testUser.setEmail("test@example.com");
        testUser.setCognitoUserId("test-cognito-user-12345");
        testUser.setPhoneNumber("+12345678901");

        // Act - Save the user to database
        User savedUser = userRepository.save(testUser);

        // Act - Retrieve the user using custom finder method
        User foundUser = userRepository.findByEmail("test@example.com");

        // Assert - Verify the custom finder method worked
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getId()).isNotNull();
        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getUsername()).isEqualTo("testuser123");
        assertThat(foundUser.getEmail()).isEqualTo("test@example.com");
        assertThat(foundUser.getCognitoUserId()).isEqualTo("test-cognito-user-12345");
    }
    
}
