package com.portfolio.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record EducationDto(
        Long id,
        @NotBlank(message = "Institution is required") String institution,
        @NotBlank(message = "Degree is required") String degree,
        @NotBlank(message = "Field of study is required") String field,
        LocalDate startDate,
        LocalDate endDate,
        boolean currentlyEnrolled,
        String description,
        int sortOrder,
        Boolean published,
        LocalDate createdAt,
        LocalDate updatedAt
) {}