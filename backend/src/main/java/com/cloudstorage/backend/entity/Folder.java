package com.cloudstorage.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

// Folder Entity - Represents a folder in the cloud storage system
// This entity creates a hierarchical folder structure where folders can
// contain files and other subfolders. The parent field allows for nested
// folder organization, and owner links each folder to its creating user.
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "folders")
public class Folder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Folder name is required")
    private String name;

    // RELATIONSHIPS: 

    // Links to the user who owns this folder
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

   // Links to parent folder (null for root folders)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = true)
    private Folder parent;

    // All files inside this folder
    @JsonIgnore
    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<File> files;

    // All subfolders inside this folder
    @JsonIgnore
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Folder> subfolders;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Constructors

    public Folder() {}

    public Folder(String name, User owner, Folder parent) {
        this.name = name;
        this.owner = owner;
        this.parent = parent;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public User getOwner() {
        return owner;
    }
    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Folder getParent() {
        return parent;
    }
    public void setParent(Folder parent) {
        this.parent = parent;
    }

    public List<File> getFiles() {
        return files;
    }
    public void setFiles(List<File> files) {
        this.files = files;
    }

    public List<Folder> getSubfolders() {
        return subfolders;
    }
    public void setSubfolders(List<Folder> subfolders) {
        this.subfolders = subfolders;
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