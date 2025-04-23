package com.auth.jwt.data.entity.assessment;

import jakarta.persistence.*;

@Entity
@Table(name = "requirement")
public class Requirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "text", nullable = false, length = 1000)
    private String text;

    @Column(name = "value")
    private String value; // "TAK", "NIE", "W REALIZACJI", "ND"

    @Column(name = "comment", length = 1000)
    private String comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id", nullable = false)
    private Area area;

    // Default constructor
    public Requirement() {
    }

    // Constructor with essential fields
    public Requirement(String text, String value, String comment) {
        this.text = text;
        this.value = value;
        this.comment = comment;
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

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Area getArea() {
        return area;
    }

    public void setArea(Area area) {
        this.area = area;
    }

    @Override
    public String toString() {
        return "Requirement{" +
                "id=" + id +
                ", text='" + text + '\'' +
                ", value='" + value + '\'' +
                ", comment='" + comment + '\'' +
                ", area=" + (area != null ? area.getId() : null) +
                '}';
    }
}
