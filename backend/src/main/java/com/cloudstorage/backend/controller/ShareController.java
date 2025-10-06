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
import com.cloudstorage.backend.entity.Share;
import com.cloudstorage.backend.service.ShareService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Optional;
import java.util.Map;

// ShareController - REST API endpoints for file sharing operations
// Handles HTTP requests for sharing files, managing permissions, and access control.
// Coordinates between frontend requests and ShareService for file sharing functionality.
@RestController
@RequestMapping("/api/shares")
public class ShareController {

    @Autowired
    private ShareService shareService;

    // Share a file with a user with specific permissions
    // Frontend sends: JSON with fileId, sharedWithId, and permission level
    @PostMapping("/create")
    public Share shareFile(@RequestBody Map<String, Object> request) {

        Long fileId = Long.valueOf(request.get("fileId").toString());
        Long sharedWithId = Long.valueOf(request.get("sharedWithId").toString());
        String permission = (String) request.get("permission");

        Share savedShare = shareService.shareFile(fileId, sharedWithId, permission);
        return savedShare;
    }

    // Get all users who have access to a specific file
    @GetMapping("/file/{fileId}")
    public List<Share> getSharesByFile(@PathVariable Long fileId) {
        return shareService.getSharesByFile(fileId);
    }

   // Get all files shared with a specific user
    @GetMapping("/user/{sharedWithId}")
    public List<Share> getSharesByUser(@PathVariable Long sharedWithId) {
        return shareService.getSharesByUser(sharedWithId);
    }

    // Get all shares with a specific permission level/type
    @GetMapping("/permission/{permission}")
    public List<Share> getSharesByPermission(@PathVariable String permission) {
        return shareService.getSharesByPermission(permission);
    }

    // Get a specific share by ID
    // Returns 404 if share doesn't exist, 200 with share data if found
    @GetMapping("/{shareId}")
    public ResponseEntity<Share> getShareById(@PathVariable Long shareId) {
        Optional<Share> share = shareService.getShareById(shareId);
        if (share.isPresent()) {
            return ResponseEntity.ok(share.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Check if a user has access to a file
    // Returns JSON with boolean hasAccess field
    @GetMapping("/access")
    public ResponseEntity<Map<String, Boolean>> checkAccess(
            @RequestParam Long fileId, 
            @RequestParam Long userId) {
        boolean hasAccess = shareService.hasAccess(fileId, userId);
        return ResponseEntity.ok(Map.of("hasAccess", hasAccess));
    }

    // Delete a share (revoke access)
    // Remove sharing access (revoke permissions)
    @DeleteMapping("/{shareId}")
    public ResponseEntity<String> removeShare(@PathVariable Long shareId) {
        shareService.removeShare(shareId);
        return ResponseEntity.ok("Share removed successfully");
    }

    // Update permission level for an existing share
    @PutMapping("/{shareId}")
    public Share updateSharePermission(@PathVariable Long shareId, @RequestBody Map<String, String> request) {
        String newPermission = request.get("permission");
        return shareService.updateSharePermission(shareId, newPermission);
    }

    // Exception handler (same pattern as UserController and FileController)
    // Global exception handler for this controller
    // Converts RuntimeExceptions to proper HTTP error responses
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                             .body("{\"error\":\"" + ex.getMessage() + "\"}");
    }
    
}