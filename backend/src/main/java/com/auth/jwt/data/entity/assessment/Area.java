package com.auth.jwt.data.entity.assessment;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "area")
public class Area {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "score")
    private String score; // "POZYTYWNA", "ZASTRZEŻENIA", "NEGATYWNA", "W REALIZACJI", "NIE DOTYCZY"

    @Column(name = "comment", length = 1000)
    private String comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_id", nullable = false)
    private Chapter chapter;

    @OneToMany(mappedBy = "area", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Requirement> requirements = new ArrayList<>();

    // Default constructor
    public Area() {
    }

    // Constructor with essential fields
    public Area(String name, String description, String score, String comment) {
        this.name = name;
        this.description = description;
        this.score = score;
        this.comment = comment;
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

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Chapter getChapter() {
        return chapter;
    }

    public void setChapter(Chapter chapter) {
        this.chapter = chapter;
    }

    public List<Requirement> getRequirements() {
        return requirements;
    }

    public void setRequirements(List<Requirement> requirements) {
        this.requirements = requirements;
    }

    // Helper methods
    public void addRequirement(Requirement requirement) {
        requirements.add(requirement);
        requirement.setArea(this);
    }

    public void removeRequirement(Requirement requirement) {
        requirements.remove(requirement);
        requirement.setArea(null);
    }

    @Override
    public String toString() {
        return "Area{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", score='" + score + '\'' +
                ", comment='" + comment + '\'' +
                ", chapter=" + (chapter != null ? chapter.getId() : null) +
                ", requirements=" + requirements.size() +
                '}';
    }
}
