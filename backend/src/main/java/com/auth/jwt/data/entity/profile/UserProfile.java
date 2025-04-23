package com.auth.jwt.data.entity.profile;

import com.auth.jwt.data.entity.employee.Employee;
import jakarta.persistence.*;

@Entity
@Table(name = "user_profile")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "phone")
    private String phone;

    @Column(name = "position")
    private String position;

    @Column(name = "notification_email", nullable = false)
    private Boolean notificationEmail = true;

    @Column(name = "notification_app", nullable = false)
    private Boolean notificationApp = true;

    @OneToOne
    @JoinColumn(name = "employee_id", unique = true)
    private Employee employee;

    // Default constructor
    public UserProfile() {
    }

    // Constructor with essential fields
    public UserProfile(String phone, String position, Boolean notificationEmail, Boolean notificationApp, Employee employee) {
        this.phone = phone;
        this.position = position;
        this.notificationEmail = notificationEmail;
        this.notificationApp = notificationApp;
        this.employee = employee;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    @Override
    public String toString() {
        return "UserProfile{" +
                "id=" + id +
                ", phone='" + phone + '\'' +
                ", position='" + position + '\'' +
                ", notificationEmail=" + notificationEmail +
                ", notificationApp=" + notificationApp +
                ", employee=" + (employee != null ? employee.getId() : null) +
                '}';
    }
}
