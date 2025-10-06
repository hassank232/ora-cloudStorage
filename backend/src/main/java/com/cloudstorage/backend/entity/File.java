package com.cloudstorage.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

// File Entity - Represents a file stored in the cloud storage system
// This entity stores file metadata in the database while the actual file
// is stored in AWS S3. The s3Key field bridges this database record to
// the physical file in S3 storage.
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "files")
public class File {

    // Basic file information

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Filename is required")
    private String filename;

    @Column(nullable = false)
    @NotNull(message = "File size is required")
    @Min(value = 1, message = "File size must be greater than 0")
    private Long fileSize; // Size in bytes

    @Column(nullable = false)
    @NotBlank(message = "MIME type is required")
    private String mimeType; // Content type (image/jpeg, application/pdf, etc.)

    // Bridge to AWS S3 - this links database record to actual file in S3
    @Column(nullable = false)
    @NotBlank(message = "S3 key is required")
    private String s3Key; // Unique identifier for file in S3 bucket

    // RELATIONSHIPS: 

    // File ownership - who uploaded this file
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    // File organization - optional folder location
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id", nullable = true)
    private Folder folder;

    // File sharing - list of users this file is shared with
    @JsonIgnore // Don't include shares in JSON responses to avoid infinite loops
    @OneToMany(mappedBy = "file", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Share> shares;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Constructors
    
    public File() {}

    public File(String filename, Long fileSize, String mimeType, String s3Key, User owner) {
        this.filename = filename;
        this.fileSize = fileSize;
        this.mimeType = mimeType;
        this.s3Key = s3Key;
        this.owner = owner;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }
    public void setFilename(String filename) {
        this.filename = filename;
    }

    public Long getFileSize() {
        return fileSize;
    }
    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getMimeType() {
        return mimeType;
    }
    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getS3Key() {
        return s3Key;
    }
    public void setS3Key(String s3Key) {
        this.s3Key = s3Key;
    }

    public User getOwner() {
        return owner;
    }
    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Folder getFolder() {
        return folder;
    }
    public void setFolder(Folder folder) {
        this.folder = folder;
    }

    public List<Share> getShares() {
        return shares;
    }
    public void setShares(List<Share> shares) {
        this.shares = shares;
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

}