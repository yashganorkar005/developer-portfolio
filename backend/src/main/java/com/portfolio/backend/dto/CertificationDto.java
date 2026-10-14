package com.portfolio.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record CertificationDto(
        Long id,
        @NotBlank(message = "Name is required") String name,
        @NotBlank(message = "Issuer is required") String issuer,
        LocalDate issueDate,
        LocalDate expiryDate,
        String credentialUrl,
        String imageUrl,
        int sortOrder,
        Boolean published,
        LocalDate createdAt,
        LocalDate updatedAt
) {}