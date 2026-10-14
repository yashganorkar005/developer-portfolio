package com.portfolio.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record ProfileDto(
        @NotBlank(message = "Name is required") String name,
        @NotBlank(message = "Tagline is required") String tagline,
        @NotBlank(message = "Bio is required") String bio,
        @NotBlank(message = "Email is required") @Email(message = "Email must be valid") String email,
        String location,
        String avatarUrl,
        @jakarta.validation.constraints.Size(max = 160, message = "Hero headline must be 160 characters or fewer") String heroHeadline,
        String resumeUrl,
        boolean available,
        LocalDate createdAt,
        LocalDate updatedAt
) {}