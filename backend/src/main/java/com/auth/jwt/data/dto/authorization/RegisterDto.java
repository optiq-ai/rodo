package com.auth.jwt.data.dto.authorization;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class RegisterDto {
    
    @NotBlank(message = "Nazwa użytkownika jest wymagana")
    private String userName;
    
    @NotBlank(message = "Hasło jest wymagane")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,}$",
        message = "Hasło musi zawierać co najmniej jedną wielką literę i jeden znak specjalny"
    )
    private char[] password;
    
    @NotBlank(message = "Imię jest wymagane")
    private String firstName;
    
    @NotBlank(message = "Nazwisko jest wymagane")
    private String lastName;
    
    @NotBlank(message = "Email jest wymagany")
    @Email(message = "Email musi być poprawny")
    private String email;

    // Default constructor
    public RegisterDto() {
    }

    // Constructor with all fields
    public RegisterDto(String userName, char[] password, String firstName, String lastName, String email) {
        this.userName = userName;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    // Getters and setters
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public char[] getPassword() {
        return password;
    }

    public void setPassword(char[] password) {
        this.password = password;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
