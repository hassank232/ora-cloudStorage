package com.cloudstorage.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cloudstorage.backend.entity.User; 

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);
    User findByEmail(String email);
    boolean existsByEmail(String email);

    User findByCognitoUserId(String cognitoUserId);

}
