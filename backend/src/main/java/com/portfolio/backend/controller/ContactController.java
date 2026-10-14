package com.portfolio.backend.controller;

import com.portfolio.backend.dto.*;
import com.portfolio.backend.entity.ContactMessage;
import com.portfolio.backend.service.ContactMessageService;
import com.portfolio.backend.service.ContactEmailService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactMessageService service;
    private final ContactEmailService emailService;

    @PostMapping
    public ResponseEntity<String> submit(
            @Valid @RequestBody ContactMessageRequest request,
            HttpServletRequest httpRequest) {

        String ip = getClientIp(httpRequest);
        if (service.isRateLimited(ip, 5)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Rate limit exceeded. Try again later.");
        }

        ContactMessage msg = new ContactMessage();
        msg.setName(request.name());
        msg.setEmail(request.email());
        msg.setSubject(request.subject());
        msg.setMessage(request.message());
        msg.setIpAddress(ip);
        msg.setRead(false);
        service.save(msg);
        emailService.sendContactNotification(msg.getName(), msg.getEmail(), msg.getSubject(), msg.getMessage());
        return ResponseEntity.ok("Message sent successfully.");
    }

    private String getClientIp(HttpServletRequest req) {
        String xfHeader = req.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isEmpty()) {
            return xfHeader.split(",")[0].trim();
        }
        return req.getRemoteAddr();
    }
}
