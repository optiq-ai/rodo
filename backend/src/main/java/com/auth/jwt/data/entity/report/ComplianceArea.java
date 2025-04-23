package com.auth.jwt.data.entity.report;

import jakarta.persistence.*;

@Entity
@Table(name = "compliance_area")
public class ComplianceArea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "score", nullable = false)
    private Integer score; // 0-100

    @Column(name = "risk")
    private String risk; // "low", "medium", "high"

    @Column(name = "last_updated")
    private java.time.LocalDate lastUpdated;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    // Default constructor
    public ComplianceArea() {
        this.lastUpdated = java.time.LocalDate.now();
    }

    // Constructor with essential fields
    public ComplianceArea(String name, Integer score, String risk) {
        this.name = name;
        this.score = score;
        this.risk = risk;
        this.lastUpdated = java.time.LocalDate.now();
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

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getRisk() {
        return risk;
    }

    public void setRisk(String risk) {
        this.risk = risk;
    }

    public java.time.LocalDate getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(java.time.LocalDate lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public Report getReport() {
        return report;
    }

    public void setReport(Report report) {
        this.report = report;
    }

    @Override
    public String toString() {
        return "ComplianceArea{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", score=" + score +
                ", risk='" + risk + '\'' +
                ", lastUpdated=" + lastUpdated +
                ", report=" + (report != null ? report.getId() : null) +
                '}';
    }
}
