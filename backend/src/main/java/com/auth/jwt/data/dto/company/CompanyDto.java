package com.auth.jwt.data.dto.company;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CompanyDto {
    private Long id;
    
    @NotBlank(message = "Nazwa firmy jest wymagana")
    @Size(max = 255, message = "Nazwa firmy nie może przekraczać 255 znaków")
    private String name;
    
    @Size(max = 255, message = "Adres nie może przekraczać 255 znaków")
    private String address;
    
    @Size(max = 100, message = "Miasto nie może przekraczać 100 znaków")
    private String city;
    
    @Size(max = 20, message = "Kod pocztowy nie może przekraczać 20 znaków")
    private String postalCode;
    
    @Size(max = 20, message = "NIP nie może przekraczać 20 znaków")
    private String nip;
    
    @Size(max = 20, message = "REGON nie może przekraczać 20 znaków")
    private String regon;
    
    @Size(max = 100, message = "Branża nie może przekraczać 100 znaków")
    private String industry;
    
    // Default constructor
    public CompanyDto() {
    }
    
    // Constructor with all fields
    public CompanyDto(Long id, String name, String address, String city, String postalCode, 
                     String nip, String regon, String industry) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.city = city;
        this.postalCode = postalCode;
        this.nip = nip;
        this.regon = regon;
        this.industry = industry;
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
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getPostalCode() {
        return postalCode;
    }
    
    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }
    
    public String getNip() {
        return nip;
    }
    
    public void setNip(String nip) {
        this.nip = nip;
    }
    
    public String getRegon() {
        return regon;
    }
    
    public void setRegon(String regon) {
        this.regon = regon;
    }
    
    public String getIndustry() {
        return industry;
    }
    
    public void setIndustry(String industry) {
        this.industry = industry;
    }
}
