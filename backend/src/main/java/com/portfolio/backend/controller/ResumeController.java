package com.portfolio.backend.controller;

import com.portfolio.backend.service.CloudinaryStorageService;

import com.portfolio.backend.service.MediaCleanupService;
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
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ResumeController {
    private final ResumeService resumeService;
    private final CloudinaryStorageService cloudinaryStorageService;
    private final MediaCleanupService mediaCleanupService;

    @GetMapping("/api/admin/resume")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getResume() {
        try {
            String url = resumeService.getResumeUrl();
            if (cloudinaryStorageService.isManagedCloudinaryUrl(url)) {
                Map<String, Object> meta = new HashMap<>();
                meta.put("filename", "resume.pdf");
                meta.put("size", cloudinaryStorageService.getFileSize(url));
                meta.put("url", url);
                return ResponseEntity.ok(meta);
            }
            Path file = resumeService.getResumePath();
            if (file == null) return ResponseEntity.ok(Collections.emptyMap());
            Map<String, Object> meta = new HashMap<>();
            meta.put("filename", file.getFileName().toString());
            meta.put("size", Files.size(file));
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
            if (file.getContentType() == null || !"application/pdf".equalsIgnoreCase(file.getContentType())) return ResponseEntity.badRequest().body("Invalid PDF content type");
            byte[] bytes = file.getBytes();
            if (bytes.length < 5 || bytes[0] != '%' || bytes[1] != 'P' || bytes[2] != 'D' || bytes[3] != 'F') return ResponseEntity.badRequest().body("Invalid PDF content");

            String oldUrl = resumeService.getResumeUrl();
            String newUrl = cloudinaryStorageService.uploadResume(file);
            // Queue the upload before saving its URL so a failed DB write cannot leave an orphan forever.
            mediaCleanupService.scheduleCandidate(oldUrl);
            mediaCleanupService.scheduleCandidate(newUrl);
            resumeService.setResumeUrl(newUrl);
            Path oldLocalFile = resumeService.getResumePath();
            if (oldLocalFile != null) Files.deleteIfExists(oldLocalFile);
            return ResponseEntity.ok("Uploaded");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Resume upload failed. Check Cloudinary environment variables and backend logs.");
        }
    }

    @DeleteMapping("/api/admin/resume")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteResume() {
        try {
            String oldUrl = resumeService.getResumeUrl();
            resumeService.setResumeUrl(null);
            mediaCleanupService.scheduleCandidate(oldUrl);
            Path oldLocalFile = resumeService.getResumePath();
            if (oldLocalFile != null) Files.deleteIfExists(oldLocalFile);
            return ResponseEntity.ok("Deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Delete failed");
        }
    }

    @GetMapping({"/api/public/resume", "/resume.pdf", "/api/resume.pdf"})
    public void publicResume(HttpServletResponse resp) throws IOException {
        String url = resumeService.getResumeUrl();
        if (url != null && url.startsWith("https://")) {
            resp.sendRedirect(url);
            return;
        }
        Path file = resumeService.getResumePath();
        if (file == null) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Resume not found. Upload it again from the admin panel.");
            return;
        }
        resp.setContentType("application/pdf");
        resp.setHeader("Content-Disposition", "inline; filename=\"resume.pdf\"");
        resp.setContentLengthLong(Files.size(file));
        Files.copy(file, resp.getOutputStream());
    }
}