package com.portfolio.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.Instant;

@Entity
@Table(name = "contact_messages",
        indexes = @Index(name = "idx_contact_created", columnList = "created_at"))
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank
    @Email
    @Column(nullable = false, length = 255)
    private String email;

    @NotBlank
    @Size(min = 4, max = 200)
    @Column(nullable = false, length = 200)
    private String subject;

    @NotBlank
    @Size(min = 10, max = 5000)
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "`read`", nullable = false)
    private boolean read = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist  protected void onCreate() { createdAt = Instant.now(); }

    public Long    getId()                         { return id; }
    public String  getName()                       { return name; }
    public void    setName(String name)            { this.name = name; }
    public String  getEmail()                      { return email; }
    public void    setEmail(String email)          { this.email = email; }
    public String  getSubject()                    { return subject; }
    public void    setSubject(String subject)      { this.subject = subject; }
    public String  getMessage()                    { return message; }
    public void    setMessage(String message)      { this.message = message; }
    public String  getIpAddress()                  { return ipAddress; }
    public void    setIpAddress(String ip)         { this.ipAddress = ip; }
    public boolean isRead()                        { return read; }
    public void    setRead(boolean read)           { this.read = read; }
    public Instant getCreatedAt()                  { return createdAt; }
}
