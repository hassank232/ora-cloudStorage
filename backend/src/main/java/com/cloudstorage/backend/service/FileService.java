package com.cloudstorage.backend.service;

import org.springframework.stereotype.Service;
import com.cloudstorage.backend.entity.File;
import com.cloudstorage.backend.entity.User;
import com.cloudstorage.backend.entity.Folder;
import com.cloudstorage.backend.repository.FileRepository;
import com.cloudstorage.backend.repository.UserRepository;
import com.cloudstorage.backend.repository.FolderRepository;
import java.util.List;
import java.util.Optional;


// FileService - Business logic for file metadata management
// Handles file database operations, validation, and relationships.
// Works with File entities (metadata) - actual files are stored in S3.
@Service
public class FileService {
    
    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final FolderRepository folderRepository;

    public FileService(FileRepository fileRepository, UserRepository userRepository, FolderRepository folderRepository) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.folderRepository = folderRepository;
    }

    // Create and save file metadata to database
    // Called after file is successfully uploaded to S3
    public File saveFile(String filename, Long fileSize, String mimeType, String s3Key, Long ownerId, Long folderId) {
        
        // Convert owner ID to User object (validates user exists)
        User owner = userRepository.findById(ownerId)
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + ownerId));

        // Prevent duplicate filenames for same user
        String uniqueFilename = getUniqueFilename(filename, ownerId);
        
        File newFile = new File();
        newFile.setFilename(uniqueFilename);
        newFile.setFileSize(fileSize);
        newFile.setMimeType(mimeType);
        newFile.setS3Key(s3Key);    // Bridge to actual file in S3
        newFile.setOwner(owner);    // Set User object instead of Long

        // Optional folder assignment (can be null for root files)
        if (folderId != null) {
            Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found with ID: " + folderId));
            newFile.setFolder(folder);
        }

        return fileRepository.save(newFile);
    }

    // Get all files owned by a user
    public List<File> getFilesByOwner(Long ownerId) {
        return fileRepository.findByOwner_Id(ownerId);
    }

    // Get all files in a specific folder
    public List<File> getFilesByFolder(Long folderId) {
        return fileRepository.findByFolder_Id(folderId);
    }

    // Get all root-level files (not in any folder)
    public List<File> getRootFiles(Long ownerId) {
        return fileRepository.findByFolderIsNullAndOwner_Id(ownerId);
    }

    // Get a specific file by ID
    public Optional<File> getFileById(Long fileId) {
        return fileRepository.findById(fileId);
    }

    // Get a file by S3 key (useful for file operations)
    public File getFileByS3Key(String s3Key) {
        return fileRepository.findByS3Key(s3Key);
    }

    // Delete file metadata from database
    public void deleteFile(Long fileId) {
        if (!fileRepository.existsById(fileId)) {
            throw new RuntimeException("File not found with ID: " + fileId);
        }
        fileRepository.deleteById(fileId);
    }

    // Update file metadata (rename operation)
    public File updateFile(Long fileId, String newFilename) {

        // check if the name passed in is nothing
        if (newFilename == null || newFilename.trim().isEmpty()) {
            throw new RuntimeException("Filename cannot be empty");
        }

        // check if the file even exists
        Optional<File> existingFile = fileRepository.findById(fileId);
        if (existingFile.isEmpty()) {
            throw new RuntimeException("File not found with ID: " + fileId);
        }

        // set the file with new name!
        File file = existingFile.get();
        file.setFilename(newFilename);
        return fileRepository.save(file);
    }

    // helper method:
    // Generate unique filename if duplicate exists
    // Example: "resume.pdf" becomes "resume (1).pdf" if duplicate exists
    private String getUniqueFilename(String originalFilename, Long ownerId) {
        
        // Return original if no duplicate exists
        if (!fileRepository.existsByFilenameAndOwner_Id(originalFilename, ownerId)) {
            return originalFilename; // "resume.pdf"
        }
        
        // Split filename into base name and extension
        String baseName;
        String extension;
        int lastDotIndex = originalFilename.lastIndexOf('.');
        
        if (lastDotIndex > 0) {
            baseName = originalFilename.substring(0, lastDotIndex); // "resume"
            extension = originalFilename.substring(lastDotIndex);              // ".pdf"
        } else {
            baseName = originalFilename;    // No extension
            extension = "";
        }
        
        // Increment counter until unique filename found
        int counter = 1;
        String newFilename;
        do {
            newFilename = baseName + " (" + counter + ")" + extension; // "resume (1).pdf"
            counter++;
        } while (fileRepository.existsByFilenameAndOwner_Id(newFilename, ownerId));
        
        return newFilename; // "resume (1).pdf"
    }

}