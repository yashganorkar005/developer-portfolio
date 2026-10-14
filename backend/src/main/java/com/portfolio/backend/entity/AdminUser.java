package com.portfolio.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;

/**
 * Represents a portfolio administrator.
 * The initial admin is created via a secure CLI command or migration — never
 * through an unauthenticated HTTP endpoint.
 */
@Entity
@Table(name = "admin_users",
        indexes = @Index(name = "idx_admin_email", columnList = "email", unique = true))
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @NotBlank
    @Size(min = 8)
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    // ── Getters / Setters ────────────────────────────────────

    public Long getId()                        { return id; }
    public String getEmail()                   { return email; }
    public void   setEmail(String email)       { this.email = email; }
    public String getPasswordHash()            { return passwordHash; }
    public void   setPasswordHash(String h)    { this.passwordHash = h; }
    public Instant getCreatedAt()              { return createdAt; }
    public Instant getUpdatedAt()              { return updatedAt; }
}
