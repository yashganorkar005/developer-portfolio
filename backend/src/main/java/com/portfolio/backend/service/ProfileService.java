package com.portfolio.backend.service;

import com.portfolio.backend.dto.ProfileDto;
import com.portfolio.backend.entity.Profile;
import com.portfolio.backend.repository.ProfileRepository;
import com.portfolio.backend.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private static final String DEFAULT_HERO_HEADLINE = "Building calm, capable digital products.";

    private final ProfileRepository profileRepository;

    public Profile getProfile() {
        return profileRepository.findById(1L)
                .orElseGet(() -> {
                    Profile p = new Profile();
                    p.setName("[Your Full Name]");
                    p.setTagline("Full-Stack Developer");
                    p.setHeroHeadline(DEFAULT_HERO_HEADLINE);
                    return profileRepository.save(p);
                });
    }

    public ProfileDto getProfileDto() {
        Profile p = getProfile();
        return new ProfileDto(
                p.getName(),
                p.getTagline(),
                p.getBio(),
                p.getEmail(),
                p.getLocation(),
                p.getAvatarUrl(),
                p.getHeroHeadline(),
                p.getResumeUrl(),
                p.isAvailable(),
                DateUtil.toDate(p.getCreatedAt()),
                DateUtil.toDate(p.getUpdatedAt())
        );
    }

    @Transactional
    public Profile updateProfile(Profile updated) {
        Profile current = getProfile();
        if (updated.getName() != null) current.setName(updated.getName());
        if (updated.getTagline() != null) current.setTagline(updated.getTagline());
        if (updated.getBio() != null) current.setBio(updated.getBio());
        if (updated.getEmail() != null) current.setEmail(updated.getEmail());
        if (updated.getLocation() != null) current.setLocation(updated.getLocation());
        if (updated.getAvatarUrl() != null) current.setAvatarUrl(updated.getAvatarUrl());
        if (updated.getHeroHeadline() != null) current.setHeroHeadline(updated.getHeroHeadline());
        if (updated.getResumeUrl() != null) current.setResumeUrl(updated.getResumeUrl());
        current.setAvailable(updated.isAvailable());
        return profileRepository.save(current);
    }
}