package com.portfolio.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "education")
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String institution;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String degree;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String field;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "currently_enrolled", nullable = false)
    private boolean currentlyEnrolled = false;

    @Column(columnDefinition = "TEXT")
    private String description;

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

    public Long      getId()                               { return id; }
    public String    getInstitution()                      { return institution; }
    public void      setInstitution(String institution)    { this.institution = institution; }
    public String    getDegree()                           { return degree; }
    public void      setDegree(String degree)              { this.degree = degree; }
    public String    getField()                            { return field; }
    public void      setField(String field)                { this.field = field; }
    public LocalDate getStartDate()                        { return startDate; }
    public void      setStartDate(LocalDate d)             { this.startDate = d; }
    public LocalDate getEndDate()                          { return endDate; }
    public void      setEndDate(LocalDate d)               { this.endDate = d; }
    public boolean   isCurrentlyEnrolled()                 { return currentlyEnrolled; }
    public void      setCurrentlyEnrolled(boolean e)       { this.currentlyEnrolled = e; }
    public String    getDescription()                      { return description; }
    public void      setDescription(String d)              { this.description = d; }
    public int       getSortOrder()                        { return sortOrder; }
    public void      setSortOrder(int o)                   { this.sortOrder = o; }
    public boolean   isPublished()                         { return published; }
    public void      setPublished(boolean p)               { this.published = p; }
    public Instant   getCreatedAt()                        { return createdAt; }
    public Instant   getUpdatedAt()                        { return updatedAt; }
}
