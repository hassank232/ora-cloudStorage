package com.cloudstorage.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cloudstorage.backend.entity.File;
import java.util.List;

public interface FileRepository extends JpaRepository<File, Long> {

    // Find files by owner (using JPA property path syntax)
    List<File> findByOwner_Id(Long ownerId);
    
    // Find files by folder (using JPA property path syntax)
    List<File> findByFolder_Id(Long folderId);
    
    // Find files at root level (no folder)
    List<File> findByFolderIsNull();
    
    // Find files at root level for specific owner (combined query)
    List<File> findByFolderIsNullAndOwner_Id(Long ownerId);
    
    // Check if file exists by name and owner (using JPA property path syntax)
    boolean existsByFilenameAndOwner_Id(String filename, Long ownerId);
    
    // Find file by S3 key (this one stays the same - no relationship involved)
    File findByS3Key(String s3Key);

}