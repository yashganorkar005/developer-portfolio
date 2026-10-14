package com.portfolio.backend.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;
import java.util.Set;

@Component
public class StorageUtil {

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg", "image/jpg", "image/pjpeg", "image/png", "image/x-png", "image/webp"
    );
    private static final long MAX_IMAGE_BYTES = 5L * 1024 * 1024;

    private final Path mediaDir;

    public StorageUtil(@Value("${app.media.storage-dir:./portfolio-media}") String dir) throws IOException {
        this.mediaDir = Paths.get(dir).toAbsolutePath().normalize();
        Files.createDirectories(mediaDir);
    }

    public String storeImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("Empty file");
        if (file.getSize() > MAX_IMAGE_BYTES) throw new IllegalArgumentException("File exceeds 5MB");
        String rawCt = file.getContentType();
        String ct = rawCt != null ? rawCt.toLowerCase().split(";")[0].trim() : null;
        if (ct == null || !ALLOWED_IMAGE_TYPES.contains(ct)) throw new IllegalArgumentException("Invalid image type");
        byte[] bytes = file.getBytes();
        if (bytes.length == 0) throw new IllegalArgumentException("Empty content");
        // Basic magic-number validation
        if (!isValidImageMagic(bytes)) throw new IllegalArgumentException("Invalid image content");
        String ext = switch (ct) {
            case "image/png", "image/x-png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
        String safeName = UUID.randomUUID() + ext;
        Path target = mediaDir.resolve(safeName).normalize();
        if (!target.startsWith(mediaDir)) throw new IllegalArgumentException("Traversal blocked");
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return "/api/media/" + safeName;
    }

    public Path resolveMedia(String identifier) {
        if (identifier == null || identifier.contains("..")) throw new IllegalArgumentException("Invalid identifier");
        String name = identifier.replaceFirst("/api/media/", "");
        Path p = mediaDir.resolve(name).normalize();
        if (!p.startsWith(mediaDir) || !Files.exists(p)) throw new IllegalArgumentException("Not found");
        return p;
    }

    private boolean isValidImageMagic(byte[] b) {
        if (b.length < 4) return false;
        // PNG: 89 50 4E 47
        if (b[0] == (byte) 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G') return true;
        // JPEG: FF D8 FF
        if (b[0] == (byte) 0xFF && b[1] == (byte) 0xD8 && b[2] == (byte) 0xFF) return true;
        // WEBP: RIFF....WEBP
        if (b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F' && b.length > 12 && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P') return true;
        return false;
    }
}
