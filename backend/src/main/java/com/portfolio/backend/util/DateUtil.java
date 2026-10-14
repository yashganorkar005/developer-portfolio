package com.portfolio.backend.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;

/** Static helpers shared across service mappers. */
public final class DateUtil {

    private DateUtil() {}

    /** Convert Instant to UTC LocalDate, or null if instant is null. */
    public static LocalDate toDate(Instant instant) {
        return instant == null ? null : instant.atZone(ZoneOffset.UTC).toLocalDate();
    }
}
