package com.auth.jwt.data.entity.report;

import jakarta.persistence.*;

@Entity
@Table(name = "recommendation")
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "text", nullable = false, length = 1000)
    private String text;

    @Column(name = "priority", nullable = false)
    private String priority; // "high", "medium", "low"

    @Column(name = "status")
    private String status; // "open", "in_progress", "completed"

    @Column(name = "due_date")
    private java.time.LocalDate dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    // Default constructor
    public Recommendation() {
    }

    // Constructor with essential fields
    public Recommendation(String text, String priority, String status, java.time.LocalDate dueDate) {
        this.text = text;
        this.priority = priority;
        this.status = status;
        this.dueDate = dueDate;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public java.time.LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(java.time.LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Report getReport() {
        return report;
    }

    public void setReport(Report report) {
        this.report = report;
    }

    @Override
    public String toString() {
        return "Recommendation{" +
                "id=" + id +
                ", text='" + text + '\'' +
                ", priority='" + priority + '\'' +
                ", status='" + status + '\'' +
                ", dueDate=" + dueDate +
                ", report=" + (report != null ? report.getId() : null) +
                '}';
    }
}
