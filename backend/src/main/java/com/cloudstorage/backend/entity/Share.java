package com.cloudstorage.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

// Share Entity - Represents file sharing permissions between users
// This entity tracks which files are shared with which users and what
// level of access they have (read, write, etc.). Links files to users
// through sharing relationships with specific permission levels.
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "shares")
public class Share {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // RELATIONSHIPS: 

    @Column(nullable = false)
    @NotBlank(message = "Permission is required")
    private String permission;

    // Links to the file being shared
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id", nullable = false)
    private File file;

    // Links to the user receiving access to the file
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_with_id", nullable = false)
    private User sharedWith;

    @CreationTimestamp
    private LocalDateTime sharedDate;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Constructors

    public Share() {}

    public Share(String permission, File file, User sharedWith) {
        this.permission = permission;
        this.file = file;
        this.sharedWith = sharedWith;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getPermission() {
        return permission;
    }
    public void setPermission(String permission) {
        this.permission = permission;
    }

    public File getFile() {
        return file;
    }
    public void setFile(File file) {
        this.file = file;
    }

    public User getSharedWith() {
        return sharedWith;
    }
    public void setSharedWith(User sharedWith) {
        this.sharedWith = sharedWith;
    }

    public LocalDateTime getSharedDate() {
        return sharedDate;
    }
    public void setSharedDate(LocalDateTime sharedDate) {
        this.sharedDate = sharedDate;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
}