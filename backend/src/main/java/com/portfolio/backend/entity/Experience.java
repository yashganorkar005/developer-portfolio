package com.portfolio.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "experience")
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String company;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String role;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "current_role", nullable = false)
    private boolean currentRole = false;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "tech_stack", columnDefinition = "TEXT")
    private String techStack;   // comma-separated

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

    public Long      getId()                         { return id; }
    public String    getCompany()                    { return company; }
    public void      setCompany(String company)      { this.company = company; }
    public String    getRole()                       { return role; }
    public void      setRole(String role)            { this.role = role; }
    public LocalDate getStartDate()                  { return startDate; }
    public void      setStartDate(LocalDate d)       { this.startDate = d; }
    public LocalDate getEndDate()                    { return endDate; }
    public void      setEndDate(LocalDate d)         { this.endDate = d; }
    public boolean   isCurrentRole()                 { return currentRole; }
    public void      setCurrentRole(boolean c)       { this.currentRole = c; }
    public String    getDescription()                { return description; }
    public void      setDescription(String d)        { this.description = d; }
    public String    getTechStack()                  { return techStack; }
    public void      setTechStack(String ts)         { this.techStack = ts; }
    public int       getSortOrder()                  { return sortOrder; }
    public void      setSortOrder(int o)             { this.sortOrder = o; }
    public boolean   isPublished()                   { return published; }
    public void      setPublished(boolean p)         { this.published = p; }
    public Instant   getCreatedAt()                  { return createdAt; }
    public Instant   getUpdatedAt()                  { return updatedAt; }
}
