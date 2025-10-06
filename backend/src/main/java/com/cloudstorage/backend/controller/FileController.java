package com.cloudstorage.backend.controller;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import com.cloudstorage.backend.entity.File;
import com.cloudstorage.backend.service.FileService;
import com.cloudstorage.backend.service.S3Service;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Map;


// FileController - REST API endpoints for file operations
// Handles HTTP requests for file upload, download, management operations.
// Coordinates between frontend requests and FileService/S3Service.
@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileService fileService;

    @Autowired
    private S3Service s3Service;

    // Upload file to S3 and save metadata to database through service/repository
    // Frontend sends: multipart form data with file + metadata
    @PostMapping("/upload")
    public File uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("ownerId") Long ownerId,
            @RequestParam(value = "folderId", required = false) Long folderId) {
        
        try {

            // Upload file to S3 and get the S3 key
            String s3Key = s3Service.uploadFile(file);
            
            // Save file metadata to database with S3 key bridge
            File savedFile = fileService.saveFile(
                file.getOriginalFilename(),
                file.getSize(),
                file.getContentType(),
                s3Key,
                ownerId,
                folderId
            );
            
            return savedFile;
            
        } catch (Exception e) {
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    // Get all files owned by a user
    @GetMapping("/owner/{ownerId}")
    public List<File> getFilesByOwner(@PathVariable Long ownerId) {
        return fileService.getFilesByOwner(ownerId);
    }

    // Get all files in a specific folder
    @GetMapping("/folder/{folderId}")
    public List<File> getFilesByFolder(@PathVariable Long folderId) {
        return fileService.getFilesByFolder(folderId);
    }

    // Get all root-level files for a user (not in any folder)
    @GetMapping("/root/{ownerId}")
    public List<File> getRootFiles(@PathVariable Long ownerId) {
        return fileService.getRootFiles(ownerId);
    }

    // Get a specific file by ID
    // Returns 404 if file doesn't exist, 200 with file data if found
    @GetMapping("/{fileId}")
    public ResponseEntity<File> getFileById(@PathVariable Long fileId) {
        Optional<File> file = fileService.getFileById(fileId);
        if (file.isPresent()) {
            return ResponseEntity.ok(file.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete file from both database and S3 storage
    // Handles cleanup if S3 deletion fails
    @DeleteMapping("/{fileId}")
    public String deleteFile(@PathVariable Long fileId) {
        Optional<File> fileOpt = fileService.getFileById(fileId);
        if (fileOpt.isEmpty()) {
            throw new RuntimeException("File not found");
        }
        
        File file = fileOpt.get();
        // Delete from database first
        fileService.deleteFile(fileId);
        
        // Attempt S3 cleanup (non-critical if fails)
        try {
            s3Service.deleteFile(file.getS3Key());
        } catch (Exception e) {
            System.err.println("S3 delete failed - manual cleanup needed: " + file.getS3Key());
        }
        
        return "File deleted successfully";
    }

    // Rename file (update filename in database)
    @PutMapping("/{fileId}")
    public File updateFile(@PathVariable Long fileId, @RequestBody Map<String, String> request) {
        String newFilename = request.get("filename");
        return fileService.updateFile(fileId, newFilename);
    }

    // Generate secure download URL for file
    // Returns temporary S3 pre-signed URL that expires in 15 minutes
    @GetMapping("/{fileId}/download")
    public Map<String, String> downloadFile(@PathVariable Long fileId) {
        Optional<File> fileOpt = fileService.getFileById(fileId);
        if (fileOpt.isEmpty()) {
            throw new RuntimeException("File not found");
        }
        
        File file = fileOpt.get();
        String downloadUrl = s3Service.generateDownloadUrl(file.getS3Key(), file.getFilename(), 15);
        
        Map<String, String> response = new HashMap<>();
        response.put("downloadUrl", downloadUrl);
        response.put("filename", file.getFilename());
        
        return response;
    }
    
    // Generate secure view URL for file
    // Returns temporary S3 pre-signed URL for viewing in browser
    @GetMapping("/{fileId}/view")
    public Map<String, String> viewFile(@PathVariable Long fileId) {
        Optional<File> fileOpt = fileService.getFileById(fileId);
        if (fileOpt.isEmpty()) {
            throw new RuntimeException("File not found");
        }
        
        File file = fileOpt.get();
        String viewUrl = s3Service.generateViewUrl(file.getS3Key(), file.getFilename(), 15);
        
        Map<String, String> response = new HashMap<>();
        response.put("viewUrl", viewUrl);
        response.put("filename", file.getFilename());
        
        return response;
    }

    // Exception handler (same pattern as UserController)
    // Global exception handler for this controller
    // Converts RuntimeExceptions to proper HTTP error responses
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                             .body("{\"error\":\"" + ex.getMessage() + "\"}");
    }
    
}