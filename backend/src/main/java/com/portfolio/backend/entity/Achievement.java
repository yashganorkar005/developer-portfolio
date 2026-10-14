package com.portfolio.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;

@Entity
@Table(name = "achievements")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 7)   // e.g. "2024-03"
    private String date;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

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

    public Long    getId()                          { return id; }
    public String  getTitle()                       { return title; }
    public void    setTitle(String title)           { this.title = title; }
    public String  getDescription()                 { return description; }
    public void    setDescription(String d)         { this.description = d; }
    public String  getDate()                        { return date; }
    public void    setDate(String date)             { this.date = date; }
    public String  getImageUrl()                    { return imageUrl; }
    public void    setImageUrl(String imageUrl)     { this.imageUrl = imageUrl; }
    public int     getSortOrder()                   { return sortOrder; }
    public void    setSortOrder(int o)              { this.sortOrder = o; }
    public boolean isPublished()                    { return published; }
    public void    setPublished(boolean p)          { this.published = p; }
    public Instant getCreatedAt()                   { return createdAt; }
    public Instant getUpdatedAt()                   { return updatedAt; }
}
