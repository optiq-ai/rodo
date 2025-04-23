package com.auth.jwt.data.dto.assessment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ChapterDto {
    private Long id;
    
    @NotBlank(message = "Nazwa rozdziału jest wymagana")
    @Size(max = 255, message = "Nazwa rozdziału nie może przekraczać 255 znaków")
    private String name;
    
    @Size(max = 1000, message = "Opis nie może przekraczać 1000 znaków")
    private String description;
    
    private Long assessmentId;
    
    // Default constructor
    public ChapterDto() {
    }
    
    // Constructor with all fields
    public ChapterDto(Long id, String name, String description, Long assessmentId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.assessmentId = assessmentId;
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
    
    public Long getAssessmentId() {
        return assessmentId;
    }
    
    public void setAssessmentId(Long assessmentId) {
        this.assessmentId = assessmentId;
    }
}
