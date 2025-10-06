package com.cloudstorage.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cloudstorage.backend.entity.Folder;
import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {

    // Find folders by owner (using JPA property path syntax)
    List<Folder> findByOwner_Id(Long ownerId);
    
    // Find subfolders within a parent folder (using JPA property path syntax)
    List<Folder> findByParent_Id(Long parentId);
    
    // Find root-level folders (no parent folder)
    List<Folder> findByParentIsNull();
    
    // Find root-level folders for specific owner (combined query)
    List<Folder> findByParentIsNullAndOwner_Id(Long ownerId);
    
    // Check if folder exists by name and owner (using JPA property path syntax)
    boolean existsByNameAndOwner_Id(String name, Long ownerId);
    
    // Find folders by name (this one stays the same - no relationship involved)
    List<Folder> findByNameContainingIgnoreCase(String name);

}