package com.portfolio.backend.controller;

import com.portfolio.backend.service.ResumeService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @GetMapping("/api/admin/resume")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getResume() {
        try {
            Path p = resumeService.getResumePath();
            if (p == null) return ResponseEntity.ok(Collections.emptyMap());
            Map<String, Object> meta = new HashMap<>();
            meta.put("filename", p.getFileName().toString());
            meta.put("size", Files.size(p));
            meta.put("url", "/api/public/resume");
            return ResponseEntity.ok(meta);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(value = "/api/admin/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) return ResponseEntity.badRequest().body("Empty file");
            if (file.getSize() > 5 * 1024 * 1024) return ResponseEntity.badRequest().body("File exceeds 5MB");
            if (file.getContentType() == null || !"application/pdf".equals(file.getContentType())) return ResponseEntity.badRequest().body("Invalid PDF content type");
            byte[] b = file.getBytes();
            if (b.length < 5 || b[0] != '%' || b[1] != 'P' || b[2] != 'D' || b[3] != 'F') return ResponseEntity.badRequest().body("Invalid PDF content");
            Path target = resumeService.getStorageDir().resolve("resume.pdf").normalize();
            if (!target.startsWith(resumeService.getStorageDir())) return ResponseEntity.badRequest().body("Invalid path");
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            resumeService.setResumeUrl("/api/public/resume");
            return ResponseEntity.ok("Uploaded");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error: " + e.getMessage());
        }
    }

    @DeleteMapping("/api/admin/resume")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteResume() {
        try {
            Path p = resumeService.getResumePath();
            if (p != null) Files.deleteIfExists(p);
            resumeService.setResumeUrl(null);
            return ResponseEntity.ok("Deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Delete failed");
        }
    }

    @GetMapping({"/api/public/resume", "/resume.pdf", "/api/resume.pdf"})
    public void publicResume(HttpServletResponse resp) throws IOException {
        Path p = resumeService.getResumePath();
        if (p == null) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Resume not found");
            return;
        }
        resp.setContentType("application/pdf");
        resp.setHeader("Content-Disposition", "inline; filename=\"resume.pdf\"");
        resp.setContentLengthLong(Files.size(p));
        Files.copy(p, resp.getOutputStream());
    }
}
