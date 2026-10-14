package com.portfolio.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.List;

public record ProjectDto(
        Long id,
        @NotBlank(message = "Title is required") String title,
        String description,
        String category,
        List<String> techStack,
        String githubUrl,
        String liveUrl,
        String imageUrl,
        boolean featured,
        int sortOrder,
        Boolean published,
        LocalDate createdAt,
        LocalDate updatedAt
) {}