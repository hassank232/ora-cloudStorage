package com.cloudstorage.backend.service;

import org.springframework.stereotype.Service;
import com.cloudstorage.backend.entity.Share;
import com.cloudstorage.backend.entity.File;
import com.cloudstorage.backend.entity.User;
import com.cloudstorage.backend.repository.ShareRepository;
import com.cloudstorage.backend.repository.FileRepository;
import com.cloudstorage.backend.repository.UserRepository;
import java.util.List;
import java.util.Optional;

// ShareService - Business logic for file sharing management
// Handles sharing operations, permission validation, and access control.
// Creates and manages sharing relationships between files and users.
@Service
public class ShareService {
    
    private final ShareRepository shareRepository;
    private final FileRepository fileRepository;
    private final UserRepository userRepository;

    public ShareService(ShareRepository shareRepository, FileRepository fileRepository, UserRepository userRepository) {
        this.shareRepository = shareRepository;
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
    }

    // Shares a file with a user with specified permissions
    public Share shareFile(Long fileId, Long sharedWithId, String permission) {
        
        // Find the file and user to share with
        File file = fileRepository.findById(fileId)
            .orElseThrow(() -> new RuntimeException("File not found with ID: " + fileId));
        User sharedWith = userRepository.findById(sharedWithId)
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + sharedWithId));

        // Check if file is already shared with this user
        if (shareRepository.existsByFile_IdAndSharedWith_Id(fileId, sharedWithId)) {
            throw new RuntimeException("File is already shared with this user");
        }

        Share newShare = new Share();
        newShare.setFile(file);
        newShare.setSharedWith(sharedWith);
        newShare.setPermission(permission);

        return shareRepository.save(newShare);
    }

    // Gets all users who have access to a specific file
    public List<Share> getSharesByFile(Long fileId) {
        return shareRepository.findByFile_Id(fileId);
    }

    // Get all files shared with a specific user
    public List<Share> getSharesByUser(Long sharedWithId) {
        return shareRepository.findBySharedWith_Id(sharedWithId);
    }

    // Gets all shares with a specific permission type
    public List<Share> getSharesByPermission(String permission) {
        return shareRepository.findByPermission(permission);
    }

    // Gets a single share by its ID
    public Optional<Share> getShareById(Long shareId) {
        return shareRepository.findById(shareId);
    }

    // Gets a specific share between a file and user (for permission checks)
    public Share getShareByFileAndUser(Long fileId, Long sharedWithId) {
        return shareRepository.findByFile_IdAndSharedWith_Id(fileId, sharedWithId);
    }

    // Delete a share (revoke access)
    // Removes sharing access (revokes permissions)
    public void removeShare(Long shareId) {
        if (!shareRepository.existsById(shareId)) {
            throw new RuntimeException("Share not found with ID: " + shareId);
        }
        shareRepository.deleteById(shareId);
    }

    // Update share permission (e.g., change from "read" to "write")
    public Share updateSharePermission(Long shareId, String newPermission) {
        Optional<Share> existingShare = shareRepository.findById(shareId);
        if (existingShare.isEmpty()) {
            throw new RuntimeException("Share not found with ID: " + shareId);
        }

        Share share = existingShare.get();
        share.setPermission(newPermission);
        return shareRepository.save(share);
    }

    // Check if a user has access to a file
    public boolean hasAccess(Long fileId, Long userId) {
        return shareRepository.existsByFile_IdAndSharedWith_Id(fileId, userId);
    }

}