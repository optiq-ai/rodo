package com.auth.jwt.data.dto.assessment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RequirementDto {
    private Long id;
    
    @NotBlank(message = "Treść wymagania jest wymagana")
    @Size(max = 1000, message = "Treść wymagania nie może przekraczać 1000 znaków")
    private String content;
    
    private String status; // "ZGODNY", "CZĘŚCIOWO ZGODNY", "NIEZGODNY", "NIE DOTYCZY"
    
    @Size(max = 1000, message = "Komentarz nie może przekraczać 1000 znaków")
    private String comment;
    
    private Long areaId;
    
    // Default constructor
    public RequirementDto() {
    }
    
    // Constructor with all fields
    public RequirementDto(Long id, String content, String status, String comment, Long areaId) {
        this.id = id;
        this.content = content;
        this.status = status;
        this.comment = comment;
        this.areaId = areaId;
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
    
    public Long getAreaId() {
        return areaId;
    }
    
    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }
}
