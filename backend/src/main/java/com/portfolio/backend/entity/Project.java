package com.portfolio.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects",
        indexes = @Index(name = "idx_project_published", columnList = "published"))
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String category;

    @Column(name = "tech_stack", columnDefinition = "TEXT")
    private String techStack;   // comma-separated — split in service layer

    @Column(name = "github_url", length = 500)
    private String githubUrl;

    @Column(name = "live_url", length = 500)
    private String liveUrl;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private boolean featured = false;

    @Column(nullable = false)
    private boolean published = true;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist  protected void onCreate() { createdAt = updatedAt = Instant.now(); }
    @PreUpdate   protected void onUpdate() { updatedAt = Instant.now(); }

    public Long    getId()                        { return id; }
    public String  getTitle()                     { return title; }
    public void    setTitle(String title)         { this.title = title; }
    public String  getDescription()               { return description; }
    public void    setDescription(String d)       { this.description = d; }
    public String  getCategory()                  { return category; }
    public void    setCategory(String c)          { this.category = c; }
    public String  getTechStack()                 { return techStack; }
    public void    setTechStack(String ts)        { this.techStack = ts; }
    public String  getGithubUrl()                 { return githubUrl; }
    public void    setGithubUrl(String url)       { this.githubUrl = url; }
    public String  getLiveUrl()                   { return liveUrl; }
    public void    setLiveUrl(String url)         { this.liveUrl = url; }
    public String  getImageUrl()                  { return imageUrl; }
    public void    setImageUrl(String url)        { this.imageUrl = url; }
    public boolean isFeatured()                   { return featured; }
    public void    setFeatured(boolean f)         { this.featured = f; }
    public boolean isPublished()                  { return published; }
    public void    setPublished(boolean p)        { this.published = p; }
    public int     getSortOrder()                 { return sortOrder; }
    public void    setSortOrder(int o)            { this.sortOrder = o; }
    public Instant getCreatedAt()                 { return createdAt; }
    public Instant getUpdatedAt()                 { return updatedAt; }
}
