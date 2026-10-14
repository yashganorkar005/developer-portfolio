package com.portfolio.backend.service;

import com.portfolio.backend.entity.Profile;
import com.portfolio.backend.repository.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.*;

@Service
public class ResumeService {
    private final ProfileRepository profileRepo;
    private final Path storageDir;

    public ResumeService(ProfileRepository profileRepo) throws Exception {
        this.profileRepo = profileRepo;
        this.storageDir = Paths.get(System.getenv().getOrDefault("RESUME_STORAGE_DIR", "./resume-storage")).toAbsolutePath().normalize();
        Files.createDirectories(storageDir);
    }

    public Path getStorageDir() { return storageDir; }

    public Path getResumePath() {
        Path p = storageDir.resolve("resume.pdf").normalize();
        if (!p.startsWith(storageDir) || !Files.exists(p)) return null;
        return p;
    }

    @Transactional
    public void setResumeUrl(String url) {
        Profile prof = profileRepo.findById(1L).orElseGet(() ->
                profileRepo.findAll().stream().findFirst().orElse(null));
        if (prof != null) {
            prof.setResumeUrl(url);
            profileRepo.save(prof);
        }
    }

    public long getFileSize() throws IOException {
        Path p = getResumePath();
        return p != null ? Files.size(p) : 0;
    }
}
