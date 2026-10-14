package com.portfolio.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record AchievementDto(
        Long id,
        @NotBlank(message = "Title is required") String title,
        @NotBlank(message = "Description is required") String description,
        String date,
        String imageUrl,
        int sortOrder,
        Boolean published,
        LocalDate createdAt,
        LocalDate updatedAt
) {}