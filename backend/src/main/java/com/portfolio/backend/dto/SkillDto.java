package com.portfolio.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record SkillDto(
        Long id,
        @NotBlank(message = "Name is required") String name,
        @NotBlank(message = "Category is required") String category,
        @Min(0) @Max(100) int proficiency,
        int sortOrder,
        Boolean published,
        LocalDate createdAt,
        LocalDate updatedAt
) {}