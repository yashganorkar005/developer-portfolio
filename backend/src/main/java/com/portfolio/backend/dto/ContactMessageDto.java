package com.portfolio.backend.dto;

import java.time.LocalDate;

public record ContactMessageDto(
        Long id,
        String name,
        String email,
        String subject,
        String message,
        boolean read,
        LocalDate createdAt
) {}