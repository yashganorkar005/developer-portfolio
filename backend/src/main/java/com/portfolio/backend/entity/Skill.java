package com.portfolio.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.Instant;

@Entity
@Table(name = "skills",
        indexes = @Index(name = "idx_skill_category", columnList = "category"))
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String category;

    @Min(0) @Max(100)
    @Column(nullable = false)
    private int proficiency;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    @Column(nullable = false)
    private boolean published = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist  protected void onCreate() { createdAt = updatedAt = Instant.now(); }
    @PreUpdate   protected void onUpdate() { updatedAt = Instant.now(); }

    public Long    getId()                      { return id; }
    public String  getName()                    { return name; }
    public void    setName(String name)         { this.name = name; }
    public String  getCategory()                { return category; }
    public void    setCategory(String c)        { this.category = c; }
    public int     getProficiency()             { return proficiency; }
    public void    setProficiency(int p)        { this.proficiency = p; }
    public int     getSortOrder()               { return sortOrder; }
    public void    setSortOrder(int o)          { this.sortOrder = o; }
    public boolean isPublished()                { return published; }
    public void    setPublished(boolean p)      { this.published = p; }
    public Instant getCreatedAt()               { return createdAt; }
    public Instant getUpdatedAt()               { return updatedAt; }
}
