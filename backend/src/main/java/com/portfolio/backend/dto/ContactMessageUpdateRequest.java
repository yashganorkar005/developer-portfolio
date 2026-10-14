package com.portfolio.backend.dto;

/** Request body for admin updates to a contact message (e.g. marking read/unread). */
public record ContactMessageUpdateRequest(
        Boolean read
) {}