package com.portfolio.backend.controller;

import com.portfolio.backend.dto.*;
import com.portfolio.backend.entity.Profile;
import com.portfolio.backend.service.*;
import com.portfolio.backend.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final ProfileService            profileService;
    private final ProjectService            projectService;
    private final SkillService              skillService;
    private final CertificationService      certService;
    private final EducationService          eduService;
    private final ExperienceService         expService;
    private final AchievementService        achService;
    private final SocialLinkService         socialService;
    private final ContactMessageService     contactService;

    @GetMapping("/profile")
    public ProfileDto getProfile() {
        Profile profile = profileService.getProfile();
        return new ProfileDto(
                profile.getName(),
                profile.getTagline(),
                profile.getBio(),
                profile.getEmail(),
                profile.getLocation(),
                profile.getAvatarUrl(),
                profile.getHeroHeadline(),
                profile.getResumeUrl(),
                profile.isAvailable(),
                DateUtil.toDate(profile.getCreatedAt()),
                DateUtil.toDate(profile.getUpdatedAt())
        );
    }

    @GetMapping("/projects")
    public List<ProjectDto> getProjects() {
        return projectService.getAllPublished();
    }

    @GetMapping("/projects/featured")
    public List<ProjectDto> getFeaturedProjects() {
        return projectService.getFeatured();
    }

    @GetMapping("/skills")
    public List<SkillDto> getSkills() {
        return skillService.getAllPublished();
    }

    @GetMapping("/certifications")
    public List<CertificationDto> getCertifications() {
        return certService.getAllPublished();
    }

    @GetMapping("/education")
    public List<EducationDto> getEducation() {
        return eduService.getAllPublished();
    }

    @GetMapping("/experience")
    public List<ExperienceDto> getExperience() {
        return expService.getAllPublished();
    }

    @GetMapping("/achievements")
    public List<AchievementDto> getAchievements() {
        return achService.getAllPublished();
    }

    @GetMapping("/social-links")
    public List<SocialLinkDto> getSocialLinks() {
        return socialService.getAllPublished();
    }

    @GetMapping("/site-info")
    public Map<String, Object> getSiteInfo() {
        return Map.of(
                "profile", getProfile(),
                "socialLinks", getSocialLinks()
        );
    }
}
