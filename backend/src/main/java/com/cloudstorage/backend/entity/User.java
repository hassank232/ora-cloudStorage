package com.cloudstorage.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.util.List;

// Prevents JSON serialization issues with JPA lazy loading
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

// Tells JPA this is a database table
@Entity
@Table(name = "users")
public class User {

    // Primary key - auto-generated ID for each user
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Username must be unique and required
    @Column(unique = true, nullable = false)
    @NotBlank(message = "Username is required")
    private String username;
    
    // Email must be unique and required
    @Column(unique = true, nullable = false)
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    // Links this user to their AWS Cognito account
    @Column(nullable = false)
    private String cognitoUserId;
    
    // Optional phone number with format validation
    @Column(unique = true, nullable = true)
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number format")
    private String phoneNumber;
    
    // Automatically set when user is created
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    // Automatically updated when user is modified
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // RELATIONSHIPS: What this user owns and has access to

    // One User can have Many Files
    // All files this user owns
    @JsonIgnore // Don't include in JSON responses (prevents infinite loops)
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<File> ownedFiles;

    // One User can have Many Folders  
    // All folders this user owns
    @JsonIgnore // Don't include in JSON responses (prevents infinite loops)
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Folder> ownedFolders;

    // One User can receive Many Shares
    // All shares received by this user (files/folders shared with them)
    @JsonIgnore // Don't include in JSON responses
    @OneToMany(mappedBy = "sharedWith", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Share> receivedShares;

    // GETTERS AND SETTERS
    // Spring needs these to convert between Java objects and JSON

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getCognitoUserId() {
        return cognitoUserId;
    }
    public void setCognitoUserId(String cognitoUserId) {
        this.cognitoUserId = cognitoUserId;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Getters and setters for relationships

    public List<File> getOwnedFiles() {
        return ownedFiles;
    }
    public void setOwnedFiles(List<File> ownedFiles) {
        this.ownedFiles = ownedFiles;
    }

    public List<Folder> getOwnedFolders() {
        return ownedFolders;
    }
    public void setOwnedFolders(List<Folder> ownedFolders) {
        this.ownedFolders = ownedFolders;
    }

    public List<Share> getReceivedShares() {
        return receivedShares;
    }
    public void setReceivedShares(List<Share> receivedShares) {
        this.receivedShares = receivedShares;
    }
    
}