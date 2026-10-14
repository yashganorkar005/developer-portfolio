package com.portfolio.backend.dto;

public record LoginResponse(
        String token,
        String tokenType,
        long expiresInMs,
        String email
) {}
