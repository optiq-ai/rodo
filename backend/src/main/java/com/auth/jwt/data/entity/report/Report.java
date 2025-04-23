package com.auth.jwt.data.entity.report;

import com.auth.jwt.data.entity.employee.Employee;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "report")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "report_type", nullable = false)
    private String reportType; // "compliance", "risk", "trend"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ComplianceArea> complianceAreas = new ArrayList<>();

    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Recommendation> recommendations = new ArrayList<>();

    // Default constructor
    public Report() {
        this.createdAt = LocalDateTime.now();
    }

    // Constructor with essential fields
    public Report(String name, String description, String reportType, Employee employee) {
        this.name = name;
        this.description = description;
        this.reportType = reportType;
        this.employee = employee;
        this.createdAt = LocalDateTime.now();
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public List<ComplianceArea> getComplianceAreas() {
        return complianceAreas;
    }

    public void setComplianceAreas(List<ComplianceArea> complianceAreas) {
        this.complianceAreas = complianceAreas;
    }

    public List<Recommendation> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<Recommendation> recommendations) {
        this.recommendations = recommendations;
    }

    // Helper methods
    public void addComplianceArea(ComplianceArea area) {
        complianceAreas.add(area);
        area.setReport(this);
    }

    public void removeComplianceArea(ComplianceArea area) {
        complianceAreas.remove(area);
        area.setReport(null);
    }

    public void addRecommendation(Recommendation recommendation) {
        recommendations.add(recommendation);
        recommendation.setReport(this);
    }

    public void removeRecommendation(Recommendation recommendation) {
        recommendations.remove(recommendation);
        recommendation.setReport(null);
    }

    @Override
    public String toString() {
        return "Report{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", createdAt=" + createdAt +
                ", reportType='" + reportType + '\'' +
                ", employee=" + (employee != null ? employee.getId() : null) +
                ", complianceAreas=" + complianceAreas.size() +
                ", recommendations=" + recommendations.size() +
                '}';
    }
}
