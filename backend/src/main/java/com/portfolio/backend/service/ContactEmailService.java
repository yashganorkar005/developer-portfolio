package com.portfolio.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Sends contact-form notification emails to the site owner.
 *
 * <p>SMTP settings are fully configurable through environment variables:
 * <ul>
 *   <li>{@code MAIL_HOST} – SMTP host (e.g. smtp.gmail.com)</li>
 *   <li>{@code MAIL_PORT} – SMTP port (587 for STARTTLS, 465 for SSL)</li>
 *   <li>{@code MAIL_USERNAME} – SMTP login / sender account</li>
 *   <li>{@code MAIL_PASSWORD} – SMTP password or app-specific password</li>
 *   <li>{@code MAIL_FROM} – "From" address shown to visitors</li>
 *   <li>{@code MAIL_TO} – recipient address (site owner's inbox)</li>
 *   <li>{@code MAIL_TLS} – enable STARTTLS (default true)</li>
 *   <li>{@code MAIL_SSL} – enable implicit SSL (default false)</li>
 *   <li>{@code MAIL_AUTH} – enable SMTP AUTH (default true)</li>
 * </ul>
 *
 * <p>Email delivery is best-effort: failures are logged and never prevent
 * contact-message persistence.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ContactEmailService {

    private final JavaMailSender mailSender;

    @Value("${mail.from:hello@example.com}")
    private String mailFrom;

    @Value("${mail.to:admin@example.com}")
    private String mailTo;

    /**
     * Sends a notification email for a new contact-form submission.
     * Called asynchronously so a slow SMTP round-trip never blocks the HTTP response.
     */
    @Async
    public void sendContactNotification(String visitorName, String visitorEmail,
                                        String subject, String message) {
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true, "UTF-8");
            helper.setFrom(mailFrom);
            helper.setTo(mailTo);
            helper.setSubject("New portfolio contact: " + visitorName);
            helper.setText(buildBody(visitorName, visitorEmail, subject, message), true);
            // Make "Reply" in the mail client address the visitor directly.
            helper.setReplyTo(visitorEmail);
            mailSender.send(mime);
            log.info("Contact notification email sent to {}", mailTo);
        } catch (MessagingException | org.springframework.mail.MailException ex) {
            // Never let email failure break contact persistence or the API response.
            log.warn("Failed to send contact notification email: {}", ex.getMessage());
        }
    }

    private String buildBody(String visitorName, String visitorEmail,
                             String subject, String message) {
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
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
