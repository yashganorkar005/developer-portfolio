package com.portfolio.backend.service;

import com.portfolio.backend.entity.Profile;
import com.portfolio.backend.repository.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ResumeService {
    private final ProfileRepository profileRepo;
    private final Path storageDir;

    public ResumeService(ProfileRepository profileRepo) throws IOException {
        this.profileRepo = profileRepo;
        this.storageDir = Paths.get(System.getenv().getOrDefault("RESUME_STORAGE_DIR", "./resume-storage")).toAbsolutePath().normalize();
        Files.createDirectories(storageDir);
    }

    public Path getStorageDir() { return storageDir; }

    public Path getResumePath() {
        Path path = storageDir.resolve("resume.pdf").normalize();
        if (!path.startsWith(storageDir) || !Files.isRegularFile(path)) return null;
        return path;
    }

    public String getResumeUrl() {
        Profile profile = profileRepo.findById(1L).orElseGet(() -> profileRepo.findAll().stream().findFirst().orElse(null));
        return profile != null ? profile.getResumeUrl() : null;
    }

    @Transactional
    public void setResumeUrl(String url) {
        Profile profile = profileRepo.findById(1L).orElseGet(() -> profileRepo.findAll().stream().findFirst().orElse(null));
        if (profile != null) {
            profile.setResumeUrl(url);
            profileRepo.save(profile);
        }
    }

    public long getFileSize() throws IOException {
        Path path = getResumePath();
        return path != null ? Files.size(path) : 0L;
    }
}