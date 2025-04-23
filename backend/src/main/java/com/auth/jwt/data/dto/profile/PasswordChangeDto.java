package com.auth.jwt.data.dto.profile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class PasswordChangeDto {
    
    @NotBlank(message = "Aktualne hasło jest wymagane")
    private String currentPassword;
    
    @NotBlank(message = "Nowe hasło jest wymagane")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,}$", 
             message = "Hasło musi zawierać co najmniej jedną wielką literę i jeden znak specjalny")
    private String newPassword;
    
    // Default constructor
    public PasswordChangeDto() {
    }
    
    // Constructor with all fields
    public PasswordChangeDto(String currentPassword, String newPassword) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
    }
    
    // Getters and setters
    public String getCurrentPassword() {
        return currentPassword;
    }
    
    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }
    
    public String getNewPassword() {
        return newPassword;
    }
    
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
