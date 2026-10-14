package com.portfolio.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "certifications")
public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String name;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String issuer;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "credential_url", length = 500)
    private String credentialUrl;

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

    public Long       getId()                        { return id; }
    public String     getName()                      { return name; }
    public void       setName(String name)           { this.name = name; }
    public String     getIssuer()                    { return issuer; }
    public void       setIssuer(String issuer)       { this.issuer = issuer; }
    public LocalDate  getIssueDate()                 { return issueDate; }
    public void       setIssueDate(LocalDate d)      { this.issueDate = d; }
    public LocalDate  getExpiryDate()                { return expiryDate; }
    public void       setExpiryDate(LocalDate d)     { this.expiryDate = d; }
    public String     getCredentialUrl()             { return credentialUrl; }
    public void       setCredentialUrl(String url)   { this.credentialUrl = url; }
    public String     getImageUrl()                  { return imageUrl; }
    public void       setImageUrl(String url)        { this.imageUrl = url; }
    public int        getSortOrder()                 { return sortOrder; }
    public void       setSortOrder(int o)            { this.sortOrder = o; }
    public boolean    isPublished()                  { return published; }
    public void       setPublished(boolean p)        { this.published = p; }
    public Instant    getCreatedAt()                 { return createdAt; }
    public Instant    getUpdatedAt()                 { return updatedAt; }
}
