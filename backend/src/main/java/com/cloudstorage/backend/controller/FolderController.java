package com.cloudstorage.backend.controller;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import com.cloudstorage.backend.entity.Folder;
import com.cloudstorage.backend.service.FolderService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Optional;
import java.util.Map;

// FolderController - REST API endpoints for folder operations
// Handles HTTP requests for folder creation, organization, and management.
// Coordinates between frontend requests and FolderService for folder hierarchy.
@RestController
@RequestMapping("/api/folders")
public class FolderController {

    @Autowired
    private FolderService folderService;

    // Create a new folder with optional parent
    // Frontend sends: JSON with name, ownerId, and optional parentId
    @PostMapping("/create")
    public Folder createFolder(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        Long ownerId = Long.valueOf(request.get("ownerId").toString());
        Long parentId = request.get("parentId") != null ? 
            Long.valueOf(request.get("parentId").toString()) : null;

        Folder savedFolder = folderService.createFolder(name, ownerId, parentId);
        return savedFolder;
    }

    // Get all folders owned by a user
    @GetMapping("/owner/{ownerId}")
    public List<Folder> getFoldersByOwner(@PathVariable Long ownerId) {
        return folderService.getFoldersByOwner(ownerId);
    }

    // Get all folders inside a parent folder
    @GetMapping("/parent/{parentId}")
    public List<Folder> getSubfolders(@PathVariable Long parentId) {
        return folderService.getSubfolders(parentId);
    }

    // Get all root-level folders for a user (no parent)
    @GetMapping("/root/{ownerId}")
    public List<Folder> getRootFolders(@PathVariable Long ownerId) {
        return folderService.getRootFolders(ownerId);
    }

    // Get a specific folder by ID
    // Returns 404 if folder doesn't exist, 200 with folder data if found
    @GetMapping("/{folderId}")
    public ResponseEntity<Folder> getFolderById(@PathVariable Long folderId) {
        Optional<Folder> folder = folderService.getFolderById(folderId);
        if (folder.isPresent()) {
            return ResponseEntity.ok(folder.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Search folders by name (case-insensitive)
    @GetMapping("/search")
    public List<Folder> searchFolders(@RequestParam String query) {
        return folderService.searchFolders(query);
    }

    // Delete a folder (must be empty of subfolders)
    @DeleteMapping("/{folderId}")
    public ResponseEntity<String> deleteFolder(@PathVariable Long folderId) {
        folderService.deleteFolder(folderId);
        return ResponseEntity.ok("Folder deleted successfully");
    }

    // Rename a folder
    @PutMapping("/{folderId}")
    public Folder updateFolder(@PathVariable Long folderId, @RequestBody Map<String, String> request) {
        String newName = request.get("name");
        return folderService.updateFolder(folderId, newName);
    }

    // Move folder to different parent (for drag & drop)
    // parentId can be null to move to root level
    @PutMapping("/{folderId}/move")
    public Folder moveFolder(@PathVariable Long folderId, @RequestBody Map<String, Object> request) {
        Long newParentId = request.get("parentId") != null ? 
            Long.valueOf(request.get("parentId").toString()) : null;
        return folderService.moveFolder(folderId, newParentId);
    }

    // Exception handler (same pattern as FileController)
    // Global exception handler for this controller
    // Converts RuntimeExceptions to proper HTTP error responses
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                             .body("{\"error\":\"" + ex.getMessage() + "\"}");
    }
    
}