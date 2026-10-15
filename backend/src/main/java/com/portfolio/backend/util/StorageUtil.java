package com.portfolio.backend.util;

import com.portfolio.backend.service.CloudinaryStorageService;

import com.portfolio.backend.service.MediaCleanupService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;

@Component
public class StorageUtil {
    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
        "image/jpeg", "image/jpg", "image/pjpeg", "image/png", "image/x-png", "image/webp"
    );
    private static final long MAX_IMAGE_BYTES = 5L * 1024 * 1024;

    private final Path mediaDir;
    private final CloudinaryStorageService cloudinary;
    private final MediaCleanupService cleanup;

    public StorageUtil(
        @Value("${app.media.storage-dir:./portfolio-media}") String dir,
        CloudinaryStorageService cloudinary,
        MediaCleanupService cleanup
    ) {
        this.mediaDir = Paths.get(dir).toAbsolutePath().normalize();
        this.cloudinary = cloudinary;
        this.cleanup = cleanup;
    }

    public String storeImage(MultipartFile file, String previousUrl) throws Exception {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("Empty file");
        if (file.getSize() > MAX_IMAGE_BYTES) throw new IllegalArgumentException("File exceeds 5MB");
        String rawCt = file.getContentType();
        String ct = rawCt != null ? rawCt.toLowerCase().split(";")[0].trim() : null;
        if (ct == null || !ALLOWED_IMAGE_TYPES.contains(ct)) throw new IllegalArgumentException("Invalid image type");
        byte[] bytes = file.getBytes();
        if (bytes.length == 0 || !isValidImageMagic(bytes)) throw new IllegalArgumentException("Invalid image content");

        String url = cloudinary.uploadImage(file);
        // Both candidates are checked against database references before deletion.
        cleanup.scheduleCandidate(previousUrl);
        cleanup.scheduleCandidate(url); // removes an upload abandoned before the admin saves it
        return url;
    }

    public Path resolveMedia(String identifier) {
        if (identifier == null || identifier.contains("..")) throw new IllegalArgumentException("Invalid identifier");
        String name = identifier.replaceFirst("^/api/media/", "");
        if (!name.matches("[A-Za-z0-9_-]+\\.(jpg|jpeg|png|webp)")) throw new IllegalArgumentException("Invalid identifier");
        Path path = mediaDir.resolve(name).normalize();
        if (!path.startsWith(mediaDir) || !Files.isRegularFile(path)) throw new IllegalArgumentException("Not found");
        return path;
    }

    public boolean deleteLocalMedia(String url) throws IOException {
        if (url == null || !url.matches("^/api/media/[A-Za-z0-9_-]+\\.(jpg|jpeg|png|webp)$")) return false;
        String name = url.substring("/api/media/".length());
        Path path = mediaDir.resolve(name).normalize();
        if (!path.startsWith(mediaDir)) return false;
        return Files.deleteIfExists(path);
    }

    private boolean isValidImageMagic(byte[] b) {
        if (b.length < 4) return false;
        if (b[0] == (byte) 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G') return true;
        if (b[0] == (byte) 0xFF && b[1] == (byte) 0xD8 && b[2] == (byte) 0xFF) return true;
        return b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F'
            && b.length > 12 && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P';
    }
}