package com.cloudstorage.backend.service;

import org.springframework.stereotype.Service;
import com.cloudstorage.backend.entity.Folder;
import com.cloudstorage.backend.entity.User;
import com.cloudstorage.backend.repository.FolderRepository;
import com.cloudstorage.backend.repository.UserRepository;
import java.util.List;
import java.util.Optional;

// FolderService - Business logic for folder management
// Handles folder operations, hierarchy validation, and relationships.
// Creates nested folder structures and manages folder organization.
@Service
public class FolderService {
    
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;

    public FolderService(FolderRepository folderRepository, UserRepository userRepository) {
        this.folderRepository = folderRepository;
        this.userRepository = userRepository;
    }

    // Creates a new folder with owner and optional parent
    public Folder createFolder(String name, Long ownerId, Long parentId) {

        // Find the user who will own this folder
        User owner = userRepository.findById(ownerId)
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + ownerId));

        // Check if folder with same name already exists for this user in same location
        if (folderRepository.existsByNameAndOwner_Id(name, ownerId)) {
            throw new RuntimeException("Folder with name '" + name + "' already exists");
        }

        Folder newFolder = new Folder();
        newFolder.setName(name);
        newFolder.setOwner(owner);

        // Set parent folder (null = root level folder)
        if (parentId != null) {
            Folder parent = folderRepository.findById(parentId)
                .orElseThrow(() -> new RuntimeException("Parent folder not found with ID: " + parentId));
            newFolder.setParent(parent);
        }

        return folderRepository.save(newFolder);
    }

    // Gets all folders owned by a specific user
    public List<Folder> getFoldersByOwner(Long ownerId) {
        return folderRepository.findByOwner_Id(ownerId);
    }

    // Get all subfolders within a parent folder
    public List<Folder> getSubfolders(Long parentId) {
        return folderRepository.findByParent_Id(parentId);
    }

    // Get all root-level folders for a user (no parent)
    public List<Folder> getRootFolders(Long ownerId) {
        return folderRepository.findByParentIsNullAndOwner_Id(ownerId);
    }

    // Get a specific folder by ID
    public Optional<Folder> getFolderById(Long folderId) {
        return folderRepository.findById(folderId);
    }

    // Search folders by name (case-insensitive)
    public List<Folder> searchFolders(String searchTerm) {
        return folderRepository.findByNameContainingIgnoreCase(searchTerm);
    }

    // Delete a folder (should be empty of files first)
    public void deleteFolder(Long folderId) {
        if (!folderRepository.existsById(folderId)) {
            throw new RuntimeException("Folder not found with ID: " + folderId);
        }
        
        // Check if folder has subfolders - can't delete if it does
        List<Folder> subfolders = folderRepository.findByParent_Id(folderId);
        if (!subfolders.isEmpty()) {
            throw new RuntimeException("Cannot delete folder: contains " + subfolders.size() + " subfolders");
        }
        
        folderRepository.deleteById(folderId);
    }

    // Renames a folder to a new name
    public Folder updateFolder(Long folderId, String newName) {
        Optional<Folder> existingFolder = folderRepository.findById(folderId);
        if (existingFolder.isEmpty()) {
            throw new RuntimeException("Folder not found with ID: " + folderId);
        }

        Folder folder = existingFolder.get();
        
        // Check if new name conflicts with existing folders for same owner
        if (folderRepository.existsByNameAndOwner_Id(newName, folder.getOwner().getId()) && 
            !folder.getName().equals(newName)) {
            throw new RuntimeException("Folder with name '" + newName + "' already exists");
        }
        
        folder.setName(newName);
        return folderRepository.save(folder);
    }

    // Move folder to different parent (for drag & drop functionality)
    public Folder moveFolder(Long folderId, Long newParentId) {
        Optional<Folder> existingFolder = folderRepository.findById(folderId);
        if (existingFolder.isEmpty()) {
            throw new RuntimeException("Folder not found with ID: " + folderId);
        }

        Folder folder = existingFolder.get();
        
        // Set new parent (null = move to root level)
        if (newParentId != null) {
            Folder newParent = folderRepository.findById(newParentId)
                .orElseThrow(() -> new RuntimeException("Parent folder not found with ID: " + newParentId));
            folder.setParent(newParent);
        } else {
            folder.setParent(null);
        }
        
        return folderRepository.save(folder);
    }
    
}