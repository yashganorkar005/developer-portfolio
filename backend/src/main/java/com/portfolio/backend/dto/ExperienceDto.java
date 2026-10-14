package com.portfolio.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.List;

public record ExperienceDto(
        Long id,
        @NotBlank(message = "Company is required") String company,
        @NotBlank(message = "Role is required") String role,
        LocalDate startDate,
        LocalDate endDate,
        boolean currentRole,
        @NotBlank(message = "Description is required") String description,
        List<String> techStack,
        int sortOrder,
        Boolean published,
        LocalDate createdAt,
        LocalDate updatedAt
) {}