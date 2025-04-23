package com.auth.jwt.data.dto.assessment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AreaDto {
    private Long id;
    
    @NotBlank(message = "Nazwa obszaru jest wymagana")
    @Size(max = 255, message = "Nazwa obszaru nie może przekraczać 255 znaków")
    private String name;
    
    @Size(max = 1000, message = "Opis nie może przekraczać 1000 znaków")
    private String description;
    
    private String score; // "POZYTYWNA", "ZASTRZEŻENIA", "NEGATYWNA", "W REALIZACJI", "NIE DOTYCZY"
    
    @Size(max = 1000, message = "Komentarz nie może przekraczać 1000 znaków")
    private String comment;
    
    private Long chapterId;
    
    // Default constructor
    public AreaDto() {
    }
    
    // Constructor with all fields
    public AreaDto(Long id, String name, String description, String score, String comment, Long chapterId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.score = score;
        this.comment = comment;
        this.chapterId = chapterId;
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
    
    public String getScore() {
        return score;
    }
    
    public void setScore(String score) {
        this.score = score;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
    
    public Long getChapterId() {
        return chapterId;
    }
    
    public void setChapterId(Long chapterId) {
        this.chapterId = chapterId;
    }
}
