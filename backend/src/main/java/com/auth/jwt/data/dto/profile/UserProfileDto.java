package com.auth.jwt.data.dto.profile;

import jakarta.validation.constraints.Size;

public class UserProfileDto {
    private Long id;
    
    @Size(max = 50, message = "Imię nie może przekraczać 50 znaków")
    private String firstName;
    
    @Size(max = 50, message = "Nazwisko nie może przekraczać 50 znaków")
    private String lastName;
    
    @Size(max = 20, message = "Numer telefonu nie może przekraczać 20 znaków")
    private String phone;
    
    @Size(max = 100, message = "Stanowisko nie może przekraczać 100 znaków")
    private String position;
    
    private Boolean notificationEmail;
    
    private Boolean notificationApp;
    
    // Default constructor
    public UserProfileDto() {
        this.notificationEmail = true;
        this.notificationApp = true;
    }
    
    // Constructor with all fields
    public UserProfileDto(Long id, String firstName, String lastName, String phone, String position, Boolean notificationEmail, Boolean notificationApp) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.position = position;
        this.notificationEmail = notificationEmail != null ? notificationEmail : true;
        this.notificationApp = notificationApp != null ? notificationApp : true;
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getPosition() {
        return position;
    }
    
    public void setPosition(String position) {
        this.position = position;
    }
    
    public Boolean getNotificationEmail() {
        return notificationEmail;
    }
    
    public void setNotificationEmail(Boolean notificationEmail) {
        this.notificationEmail = notificationEmail;
    }
    
    public Boolean getNotificationApp() {
        return notificationApp;
    }
    
    public void setNotificationApp(Boolean notificationApp) {
        this.notificationApp = notificationApp;
    }
}
