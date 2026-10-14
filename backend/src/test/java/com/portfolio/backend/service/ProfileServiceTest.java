package com.portfolio.backend.service;

import com.portfolio.backend.dto.ProfileDto;
import com.portfolio.backend.entity.Profile;
import com.portfolio.backend.repository.ProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private ProfileRepository profileRepository;

    @InjectMocks
    private ProfileService profileService;

    private Profile sampleProfile;

    @BeforeEach
    void setUp() {
        sampleProfile = new Profile();
        sampleProfile.setName("Alex Developer");
        sampleProfile.setTagline("Full-Stack Engineer");
        sampleProfile.setBio("Passionate developer");
        sampleProfile.setEmail("alex@example.com");
        sampleProfile.setLocation("San Francisco, CA");
        sampleProfile.setAvatarUrl("/api/media/profile.jpg");
        sampleProfile.setHeroHeadline("Building calm, capable digital products.");
        sampleProfile.setResumeUrl("/resume.pdf");
        sampleProfile.setAvailable(true);
    }

    @Test
    void getProfile_whenExists_returnsProfile() {
        when(profileRepository.findById(1L)).thenReturn(Optional.of(sampleProfile));

        Profile result = profileService.getProfile();

        assertNotNull(result);
        assertEquals("Alex Developer", result.getName());
        assertEquals("Building calm, capable digital products.", result.getHeroHeadline());
        assertEquals("/api/media/profile.jpg", result.getAvatarUrl());
    }

    @Test
    void getProfile_whenMissing_createsDefaultWithHeroHeadline() {
        when(profileRepository.findById(1L)).thenReturn(Optional.empty());
        when(profileRepository.save(any(Profile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Profile result = profileService.getProfile();

        assertNotNull(result);
        assertEquals("Building calm, capable digital products.", result.getHeroHeadline());
        verify(profileRepository).save(any(Profile.class));
    }

    @Test
    void getProfileDto_mapsAllFieldsCorrectly() {
        when(profileRepository.findById(1L)).thenReturn(Optional.of(sampleProfile));

        ProfileDto dto = profileService.getProfileDto();

        assertNotNull(dto);
        assertEquals("Alex Developer", dto.name());
        assertEquals("Full-Stack Engineer", dto.tagline());
        assertEquals("Building calm, capable digital products.", dto.heroHeadline());
        assertEquals("/api/media/profile.jpg", dto.avatarUrl());
        assertTrue(dto.available());
    }

    @Test
    void updateProfile_updatesHeroHeadlineAndAvatarUrl() {
        when(profileRepository.findById(1L)).thenReturn(Optional.of(sampleProfile));
        when(profileRepository.save(any(Profile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Profile updateInput = new Profile();
        updateInput.setName("Updated Alex");
        updateInput.setHeroHeadline("Crafting modern distributed cloud platforms.");
        updateInput.setAvatarUrl("/api/media/new-avatar.png");
        updateInput.setAvailable(false);

        Profile updated = profileService.updateProfile(updateInput);

        assertNotNull(updated);
        assertEquals("Updated Alex", updated.getName());
        assertEquals("Crafting modern distributed cloud platforms.", updated.getHeroHeadline());
        assertEquals("/api/media/new-avatar.png", updated.getAvatarUrl());
        assertFalse(updated.isAvailable());
        verify(profileRepository).save(sampleProfile);
    }
}
