package com.portfolio.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Sends contact-form notifications through Brevo's HTTPS API.
 * Contact messages are saved independently by ContactController before this service is called.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ContactEmailService {

    private static final URI BREVO_SEND_URI = URI.create("https://api.brevo.com/v3/smtp/email");
    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    private final ObjectMapper objectMapper;

    @Value("${BREVO_API_KEY:}")
    private String brevoApiKey;

    @Value("${mail.from:}")
    private String mailFrom;

    @Value("${mail.to:}")
    private String mailTo;

    /**
     * Sends an owner notification without blocking the contact-form HTTP response.
     * Failures are logged and do not undo the message already saved in MySQL.
     */
    @Async
    public void sendContactNotification(String visitorName, String visitorEmail,
                                        String subject, String message) {
        if (isBlank(brevoApiKey) || isPlaceholderEmail(mailFrom) || isPlaceholderEmail(mailTo)) {
            log.warn("Brevo notification skipped: configure BREVO_API_KEY, MAIL_FROM, and MAIL_TO with valid values; the contact message remains saved.");
            return;
        }

        try {
            Map<String, Object> sender = Map.of(
                    "name", "Portfolio Contact Form",
                    "email", mailFrom.trim()
            );
            Map<String, Object> recipient = Map.of("email", mailTo.trim());
            Map<String, Object> replyTo = Map.of(
                    "email", safeText(visitorEmail),
                    "name", singleLine(visitorName)
            );

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("sender", sender);
            payload.put("to", List.of(recipient));
            payload.put("replyTo", replyTo);
            payload.put("subject", "New portfolio contact: " + singleLine(visitorName));
            payload.put("htmlContent", buildBody(visitorName, visitorEmail, subject, message));

            String json = objectMapper.writeValueAsString(payload);
            HttpRequest request = HttpRequest.newBuilder(BREVO_SEND_URI)
                    .timeout(Duration.ofSeconds(12))
                    .header("api-key", brevoApiKey.trim())
                    .header("accept", "application/json")
                    .header("content-type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = HTTP_CLIENT.send(
                    request,
                    HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8)
            );

            int status = response.statusCode();
            if (status >= 200 && status < 300) {
                log.info("Brevo accepted the portfolio contact notification (HTTP {}).", status);
            } else {
                log.warn("Brevo rejected the portfolio contact notification (HTTP {}). Response: {}",
                        status, truncate(response.body(), 400));
            }
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            log.warn("Brevo contact notification was interrupted; the contact message remains saved.");
        } catch (IOException ex) {
            log.warn("Could not send contact notification through Brevo HTTPS API: {}", ex.getClass().getSimpleName());
        } catch (RuntimeException ex) {
            log.warn("Brevo contact notification failed: {}", ex.getClass().getSimpleName());
        }
    }

    private String buildBody(String visitorName, String visitorEmail, String subject, String message) {
        return "<html><body style=\"font-family:system-ui,sans-serif\">"
                + "<h2>New contact-form submission</h2>"
                + "<p><strong>Name:</strong> " + escape(visitorName) + "</p>"
                + "<p><strong>Email:</strong> <a href=\"mailto:" + escape(visitorEmail) + "\">"
                + escape(visitorEmail) + "</a></p>"
                + "<p><strong>Subject:</strong> " + escape(subject) + "</p>"
                + "<p><strong>Message:</strong></p>"
                + "<p style=\"white-space:pre-wrap\">" + escape(message) + "</p>"
                + "<hr><p style=\"color:#666\">This is an automated notification from your portfolio contact form.</p>"
                + "</body></html>";
    }

    private String escape(String value) {
        if (value == null) return "";
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String singleLine(String value) {
        if (value == null) return "Visitor";
        return value.replace('\r', ' ').replace('\n', ' ').trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private boolean isPlaceholderEmail(String value) {
        if (isBlank(value)) return true;
        String normalized = value.trim().toLowerCase();
        return normalized.endsWith("@example.com") || normalized.equals("example.com");
    }

    private String truncate(String value, int maxLength) {
        if (value == null) return "";
        String singleLine = value.replace('\r', ' ').replace('\n', ' ');
        return singleLine.length() <= maxLength ? singleLine : singleLine.substring(0, maxLength);
    }
}