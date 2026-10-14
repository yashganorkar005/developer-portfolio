package com.portfolio.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;

/** Singleton profile row — the portfolio owner's personal details. */
@Entity
@Table(name = "profile")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 150)
    private String tagline;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 255)
    private String email;

    @Column(length = 100)
    private String location;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "hero_headline", nullable = false, length = 160)
    private String heroHeadline = "Building calm, capable digital products.";

    @Column(name = "resume_url", length = 500)
    private String resumeUrl;

    @Column(name = "is_available", nullable = false)
    private boolean available = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist  protected void onCreate() { createdAt = updatedAt = Instant.now(); }
    @PreUpdate   protected void onUpdate() { updatedAt = Instant.now(); }

    public Long    getId()                          { return id; }
    public String  getName()                        { return name; }
    public void    setName(String name)             { this.name = name; }
    public String  getTagline()                     { return tagline; }
    public void    setTagline(String tagline)       { this.tagline = tagline; }
    public String  getBio()                         { return bio; }
    public void    setBio(String bio)               { this.bio = bio; }
    public String  getEmail()                       { return email; }
    public void    setEmail(String email)           { this.email = email; }
    public String  getLocation()                    { return location; }
    public void    setLocation(String location)     { this.location = location; }
    public String  getAvatarUrl()                   { return avatarUrl; }
    public void    setAvatarUrl(String url)         { this.avatarUrl = url; }
    public String  getHeroHeadline()                { return heroHeadline; }
    public void    setHeroHeadline(String headline) { this.heroHeadline = headline; }
    public String  getResumeUrl()                   { return resumeUrl; }
    public void    setResumeUrl(String url)         { this.resumeUrl = url; }
    public boolean isAvailable()                    { return available; }
    public void    setAvailable(boolean available)  { this.available = available; }
    public Instant getCreatedAt()                   { return createdAt; }
    public Instant getUpdatedAt()                   { return updatedAt; }
}
