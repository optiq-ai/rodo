package com.auth.jwt.data.entity.subscription;

import com.auth.jwt.data.entity.employee.Employee;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "subscription")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "plan", nullable = false)
    private String plan; // "basic", "premium"

    @Column(name = "status", nullable = false)
    private String status; // "active", "canceled"

    @Column(name = "next_billing_date")
    private LocalDate nextBillingDate;

    @Column(name = "payment_method")
    private String paymentMethod; // "card", "transfer"

    @OneToOne
    @JoinColumn(name = "employee_id", unique = true)
    private Employee employee;

    // Default constructor
    public Subscription() {
    }

    // Constructor with essential fields
    public Subscription(String plan, String status, LocalDate nextBillingDate, String paymentMethod, Employee employee) {
        this.plan = plan;
        this.status = status;
        this.nextBillingDate = nextBillingDate;
        this.paymentMethod = paymentMethod;
        this.employee = employee;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlan() {
        return plan;
    }

    public void setPlan(String plan) {
        this.plan = plan;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getNextBillingDate() {
        return nextBillingDate;
    }

    public void setNextBillingDate(LocalDate nextBillingDate) {
        this.nextBillingDate = nextBillingDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    @Override
    public String toString() {
        return "Subscription{" +
                "id=" + id +
                ", plan='" + plan + '\'' +
                ", status='" + status + '\'' +
                ", nextBillingDate=" + nextBillingDate +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", employee=" + (employee != null ? employee.getId() : null) +
                '}';
    }
}
