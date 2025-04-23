package com.auth.jwt.data.dto.assessment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class AssessmentDto {
    private Long id;
    
    @NotBlank(message = "Nazwa oceny jest wymagana")
    @Size(max = 255, message = "Nazwa oceny nie może przekraczać 255 znaków")
    private String name;
    
    @Size(max = 1000, message = "Opis nie może przekraczać 1000 znaków")
    private String description;
    
    @NotBlank(message = "Status oceny jest wymagany")
    private String status; // "W TRAKCIE", "ZAKOŃCZONA", "DRAFT"
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Default constructor
    public AssessmentDto() {
    }
    
    // Constructor with all fields
    public AssessmentDto(Long id, String name, String description, String status, 
                        LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and setters
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
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
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
