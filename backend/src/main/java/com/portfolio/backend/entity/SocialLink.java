package com.portfolio.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;

@Entity
@Table(name = "social_links")
public class SocialLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String platform;   // e.g. "GitHub", "LinkedIn"

    @NotBlank
    @Column(nullable = false, length = 500)
    private String url;

    @Column(name = "icon_name", length = 50)
    private String iconName;   // lucide icon name for frontend

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

    public Long    getId()                       { return id; }
    public String  getPlatform()                 { return platform; }
    public void    setPlatform(String platform)  { this.platform = platform; }
    public String  getUrl()                      { return url; }
    public void    setUrl(String url)            { this.url = url; }
    public String  getIconName()                 { return iconName; }
    public void    setIconName(String icon)      { this.iconName = icon; }
    public int     getSortOrder()                { return sortOrder; }
    public void    setSortOrder(int o)           { this.sortOrder = o; }
    public boolean isPublished()                 { return published; }
    public void    setPublished(boolean p)       { this.published = p; }
    public Instant getCreatedAt()                { return createdAt; }
    public Instant getUpdatedAt()                { return updatedAt; }
}
