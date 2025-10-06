package com.cloudstorage.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cloudstorage.backend.entity.Share;
import java.util.List;

public interface ShareRepository extends JpaRepository<Share, Long> {

    // Find shares by file (using JPA property path syntax)
    List<Share> findByFile_Id(Long fileId);
    
    // Find shares by user who received them (using JPA property path syntax)
    List<Share> findBySharedWith_Id(Long sharedWithId);
    
    // Find specific share by file and user (using JPA property path syntax)
    Share findByFile_IdAndSharedWith_Id(Long fileId, Long sharedWithId);
    
    // Check if file is already shared with user (using JPA property path syntax)
    boolean existsByFile_IdAndSharedWith_Id(Long fileId, Long sharedWithId);
    
    // Find shares by permission type (this one stays the same - no relationship involved)
    List<Share> findByPermission(String permission);

}