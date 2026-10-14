package com.portfolio.backend.controller;

import com.portfolio.backend.util.StorageUtil;
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

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MediaController {

    private final StorageUtil storageUtil;

    @PostMapping(value = "/admin/upload/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String url = storageUtil.storeImage(file);
            return ResponseEntity.ok(url);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed");
        }
    }

    @GetMapping("/media/{filename}")
    public void serveMedia(@PathVariable String filename, HttpServletResponse resp) throws IOException {
        try {
            Path file = storageUtil.resolveMedia("/api/media/" + filename);
            String contentType = Files.probeContentType(file);
            if (contentType == null) contentType = MediaType.IMAGE_JPEG_VALUE;
            resp.setContentType(contentType);
            resp.setContentLengthLong(Files.size(file));
            Files.copy(file, resp.getOutputStream());
        } catch (IllegalArgumentException e) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Media not found");
        }
    }
}
