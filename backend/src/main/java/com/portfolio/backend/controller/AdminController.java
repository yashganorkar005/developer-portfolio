package com.portfolio.backend.controller;

import com.portfolio.backend.dto.*;
import com.portfolio.backend.entity.ContactMessage;
import com.portfolio.backend.entity.Profile;
import com.portfolio.backend.exception.ResourceNotFoundException;
import com.portfolio.backend.service.*;
import com.portfolio.backend.util.DateUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ProjectService projectService;
    private final SkillService skillService;
    private final CertificationService certificationService;
    private final EducationService educationService;
    private final ExperienceService experienceService;
    private final AchievementService achievementService;
    private final SocialLinkService socialLinkService;
    private final ProfileService profileService;
    private final ContactMessageService contactMessageService;
    private final SkillCategoryOrderService skillCategoryOrderService;

    // ── Reorder (Task 2) ───────────────────────────────────────
    @PutMapping("/reorder/{entityType}/{id}")
    public void reorder(
            @PathVariable String entityType,
            @PathVariable Long id,
            @RequestParam int newOrder) {
        switch (entityType.toLowerCase()) {
            case "projects" -> projectService.reorder(id, newOrder);
            case "certifications" -> certificationService.reorder(id, newOrder);
            case "achievements" -> achievementService.reorder(id, newOrder);
            case "education" -> educationService.reorder(id, newOrder);
            case "experience" -> experienceService.reorder(id, newOrder);
            case "skills" -> skillService.reorder(id, newOrder);
            case "social-links" -> socialLinkService.reorder(id, newOrder);
            default -> throw new IllegalArgumentException("Unknown entity: " + entityType);
        }
    }

    // ── Projects ──────────────────────────────────────
    @GetMapping("/projects")
    public List<ProjectDto> getAllProjects() {
        return projectService.getAllProjects();
    }

    @PostMapping("/projects")
    public ProjectDto createProject(@Valid @RequestBody ProjectDto dto) {
        return projectService.create(dto);
    }

    @PutMapping("/projects/{id}")
    public ProjectDto updateProject(@PathVariable Long id, @Valid @RequestBody ProjectDto dto) {
        return projectService.update(id, dto);
    }

    @DeleteMapping("/projects/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(@PathVariable Long id) {
        projectService.delete(id);
    }

    // ── Skills ────────────────────────────────────────
    @GetMapping("/skills")
    public List<SkillDto> getAllSkills() {
        return skillService.getAll();
    }

    @PostMapping("/skills")
    public SkillDto createSkill(@Valid @RequestBody SkillDto dto) {
        return skillService.create(dto);
    }

    @PutMapping("/skills/{id}")
    public SkillDto updateSkill(@PathVariable Long id, @Valid @RequestBody SkillDto dto) {
        return skillService.update(id, dto);
    }

    @DeleteMapping("/skills/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSkill(@PathVariable Long id) {
        skillService.delete(id);
    }

    @GetMapping("/skill-category-orders")
    public List<SkillCategoryOrderDto> getAllSkillCategoryOrders() {
        return skillCategoryOrderService.getAll();
    }

    @PutMapping("/skill-category-orders/{category}")
    public void updateSkillCategoryOrder(@PathVariable String category, @RequestParam int newOrder) {
        skillCategoryOrderService.reorder(category, newOrder);
    }

    // ── Certifications ────────────────────────────────
    @GetMapping("/certifications")
    public List<CertificationDto> getAllCertifications() {
        return certificationService.getAll();
    }

    @PostMapping("/certifications")
    public CertificationDto createCertification(@Valid @RequestBody CertificationDto dto) {
        return certificationService.create(dto);
    }

    @PutMapping("/certifications/{id}")
    public CertificationDto updateCertification(@PathVariable Long id, @Valid @RequestBody CertificationDto dto) {
        return certificationService.update(id, dto);
    }

    @DeleteMapping("/certifications/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCertification(@PathVariable Long id) {
        certificationService.delete(id);
    }

    // ── Education ─────────────────────────────────────
    @GetMapping("/education")
    public List<EducationDto> getAllEducation() {
        return educationService.getAll();
    }

    @PostMapping("/education")
    public EducationDto createEducation(@Valid @RequestBody EducationDto dto) {
        return educationService.create(dto);
    }

    @PutMapping("/education/{id}")
    public EducationDto updateEducation(@PathVariable Long id, @Valid @RequestBody EducationDto dto) {
        return educationService.update(id, dto);
    }

    @DeleteMapping("/education/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEducation(@PathVariable Long id) {
        educationService.delete(id);
    }

    // ── Experience ────────────────────────────────────
    @GetMapping("/experience")
    public List<ExperienceDto> getAllExperience() {
        return experienceService.getAll();
    }

    @PostMapping("/experience")
    public ExperienceDto createExperience(@Valid @RequestBody ExperienceDto dto) {
        return experienceService.create(dto);
    }

    @PutMapping("/experience/{id}")
    public ExperienceDto updateExperience(@PathVariable Long id, @Valid @RequestBody ExperienceDto dto) {
        return experienceService.update(id, dto);
    }

    @DeleteMapping("/experience/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExperience(@PathVariable Long id) {
        experienceService.delete(id);
    }

    // ── Achievements ──────────────────────────────────
    @GetMapping("/achievements")
    public List<AchievementDto> getAllAchievements() {
        return achievementService.getAll();
    }

    @PostMapping("/achievements")
    public AchievementDto createAchievement(@Valid @RequestBody AchievementDto dto) {
        return achievementService.create(dto);
    }

    @PutMapping("/achievements/{id}")
    public AchievementDto updateAchievement(@PathVariable Long id, @Valid @RequestBody AchievementDto dto) {
        return achievementService.update(id, dto);
    }

    @DeleteMapping("/achievements/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAchievement(@PathVariable Long id) {
        achievementService.delete(id);
    }

    // ── Social Links ──────────────────────────────────
    @GetMapping("/social-links")
    public List<SocialLinkDto> getAllSocialLinks() {
        return socialLinkService.getAll();
    }

    @PostMapping("/social-links")
    public SocialLinkDto createSocialLink(@Valid @RequestBody SocialLinkDto dto) {
        return socialLinkService.create(dto);
    }

    @PutMapping("/social-links/{id}")
    public SocialLinkDto updateSocialLink(@PathVariable Long id, @Valid @RequestBody SocialLinkDto dto) {
        return socialLinkService.update(id, dto);
    }

    @DeleteMapping("/social-links/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSocialLink(@PathVariable Long id) {
        socialLinkService.delete(id);
    }

    // ── Profile ────────────────────────────────────────
    @GetMapping("/profile")
    public ProfileDto getProfile() {
        return profileService.getProfileDto();
    }

    @PutMapping("/profile")
    public ProfileDto updateProfile(@Valid @RequestBody ProfileDto dto) {
        Profile entity = profileService.getProfile();
        // Only editable fields; id and audit timestamps excluded
        entity.setName(dto.name());
        entity.setTagline(dto.tagline());
        entity.setBio(dto.bio());
        entity.setEmail(dto.email());
        entity.setLocation(dto.location());
        entity.setAvatarUrl(dto.avatarUrl());
        entity.setHeroHeadline(dto.heroHeadline());
        entity.setResumeUrl(dto.resumeUrl());
        entity.setAvailable(dto.available());
        Profile updated = profileService.updateProfile(entity);
        return new ProfileDto(
                updated.getName(),
                updated.getTagline(),
                updated.getBio(),
                updated.getEmail(),
                updated.getLocation(),
                updated.getAvatarUrl(),
                updated.getHeroHeadline(),
                updated.getResumeUrl(),
                updated.isAvailable(),
                DateUtil.toDate(updated.getCreatedAt()),
                DateUtil.toDate(updated.getUpdatedAt())
        );
    }

    // ── Contact Messages ──────────────────────────────
    @GetMapping("/contact-messages")
    public List<ContactMessageDto> getAllContactMessages() {
        return contactMessageService.findAll().stream().map(this::toContactMessageDto).toList();
    }

    @PutMapping("/contact-messages/{id}")
    public ContactMessageDto updateContactMessage(
            @PathVariable Long id,
            @Valid @RequestBody ContactMessageUpdateRequest dto) {
        ContactMessage entity = contactMessageService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ContactMessage", id));
        if (dto.read() != null) {
            entity.setRead(dto.read());
        }
        ContactMessage saved = contactMessageService.save(entity);
        return toContactMessageDto(saved);
    }

    @DeleteMapping("/contact-messages/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteContactMessage(@PathVariable Long id) {
        contactMessageService.delete(id);
    }

    private ContactMessageDto toContactMessageDto(ContactMessage e) {
        return new ContactMessageDto(
                e.getId(),
                e.getName(),
                e.getEmail(),
                e.getSubject(),
                e.getMessage(),
                e.isRead(),
                DateUtil.toDate(e.getCreatedAt())
        );
    }
}