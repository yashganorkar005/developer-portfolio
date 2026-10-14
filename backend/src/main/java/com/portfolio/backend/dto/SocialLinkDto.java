package com.portfolio.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record SocialLinkDto(
        Long id,
        @NotBlank(message = "Platform is required") String platform,
        @NotBlank(message = "URL is required") String url,
        String iconName,
        int sortOrder,
        Boolean published,
        LocalDate createdAt,
        LocalDate updatedAt
) {}