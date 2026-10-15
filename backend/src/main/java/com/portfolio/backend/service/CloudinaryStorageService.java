package com.portfolio.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryStorageService {
    @Value("${CLOUDINARY_CLOUD_NAME:}")
    private String cloudName;
    @Value("${CLOUDINARY_API_KEY:}")
    private String apiKey;
    @Value("${CLOUDINARY_API_SECRET:}")
    private String apiSecret;

    private Cloudinary client() {
        if (blank(cloudName) || blank(apiKey) || blank(apiSecret)) {
            throw new IllegalStateException("Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in the backend environment.");
        }
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", cloudName.trim(),
            "api_key", apiKey.trim(),
            "api_secret", apiSecret.trim(),
            "secure", true
        ));
    }

    public String uploadImage(MultipartFile file) throws Exception {
        Map<?, ?> result = client().uploader().upload(file.getBytes(), ObjectUtils.asMap(
            "resource_type", "image",
            "asset_folder", "portfolio/images",
            "public_id", "portfolio/images/" + UUID.randomUUID().toString(),
            "overwrite", false,
            "unique_filename", false
        ));
        return secureUrl(result);
    }

    public String uploadResume(MultipartFile file) throws Exception {
        Map<?, ?> result = client().uploader().upload(file.getBytes(), ObjectUtils.asMap(
            "resource_type", "image",
            "asset_folder", "portfolio/resumes",
            "public_id", "portfolio/resumes/resume-" + UUID.randomUUID(),
            "overwrite", false,
            "unique_filename", false,
            "filename_override", "resume.pdf"
        ));
        return secureUrl(result);
    }

    public boolean isManagedCloudinaryUrl(String url) {
        if (blank(url) || blank(cloudName)) return false;
        try {
            URI uri = URI.create(url);
            if (!"https".equalsIgnoreCase(uri.getScheme()) || !"res.cloudinary.com".equalsIgnoreCase(uri.getHost())) return false;
            String prefix = "/" + cloudName.trim() + "/image/upload/";
            String path = uri.getPath();
            if (path == null || !path.startsWith(prefix)) return false;
            String tail = path.substring(prefix.length()).replaceFirst("^v[0-9]+/", "");
            return tail.startsWith("portfolio/images/") || tail.startsWith("portfolio/resumes/");
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }

    public void deleteManagedAsset(String url) throws Exception {
        if (!isManagedCloudinaryUrl(url)) return;
        String publicId = extractPublicId(url);
        client().uploader().destroy(publicId, ObjectUtils.asMap(
            "resource_type", "image", "type", "upload", "invalidate", true
        ));
    }

    public long getFileSize(String url) {
        try {
            if (!isManagedCloudinaryUrl(url)) return 0L;
            Map<?, ?> details = client().api().resource(extractPublicId(url), ObjectUtils.asMap("resource_type", "image"));
            Object bytes = details.get("bytes");
            return bytes instanceof Number ? ((Number) bytes).longValue() : 0L;
        } catch (Exception ignored) {
            return 0L;
        }
    }

    private String extractPublicId(String url) {
        if (!isManagedCloudinaryUrl(url)) throw new IllegalArgumentException("URL is not a managed portfolio Cloudinary asset");
        String path = URI.create(url).getPath();
        String marker = "/image/upload/";
        int index = path.indexOf(marker);
        String id = path.substring(index + marker.length()).replaceFirst("^v[0-9]+/", "");
        int slash = id.lastIndexOf('/');
        int dot = id.lastIndexOf('.');
        if (dot > slash) id = id.substring(0, dot);
        return id;
    }

    private String secureUrl(Map<?, ?> result) {
        Object value = result.get("secure_url");
        if (!(value instanceof String) || !((String) value).startsWith("https://")) {
            throw new IllegalStateException("Cloudinary did not return a secure URL");
        }
        return (String) value;
    }

    private boolean blank(String value) { return value == null || value.trim().isEmpty(); }
}