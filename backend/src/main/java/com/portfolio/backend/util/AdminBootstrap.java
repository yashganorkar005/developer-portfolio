package com.portfolio.backend.util;

import com.portfolio.backend.entity.AdminUser;
import com.portfolio.backend.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Secure initial-admin creation.
 *
 * This runs once on startup and only creates an admin if NONE exists yet.
 * Credentials come from environment variables — never from code.
 *
 * Required env vars:
 *   ADMIN_EMAIL=admin@example.com
 *   ADMIN_PASSWORD=change_me_strong_password
 *
 * After the first admin exists, this runner is a no-op. To rotate credentials,
 * update the row directly in the database or use a future admin endpoint.
 *
 * SECURITY NOTE: Never expose admin creation via an unauthenticated HTTP endpoint.
 */
@Component
@RequiredArgsConstructor
public class AdminBootstrap implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (adminUserRepository.count() > 0) {
            return; // already seeded — do nothing
        }

        String email    = System.getenv("ADMIN_EMAIL");
        String password = System.getenv("ADMIN_PASSWORD");

        if (email == null || email.isBlank()
                || password == null || password.isBlank()) {
            System.out.println("""
                    [AdminBootstrap] ADMIN_EMAIL / ADMIN_PASSWORD not set.
                    Set these environment variables before first startup, or
                    insert the first admin row manually via SQL.
                    Skipping automatic admin creation.""");
            return;
        }

        if (adminUserRepository.existsByEmail(email)) {
            return;
        }

        AdminUser admin = new AdminUser();
        admin.setEmail(email);
        admin.setPasswordHash(passwordEncoder.encode(password));
        adminUserRepository.save(admin);

        System.out.println("[AdminBootstrap] Initial admin created: " + email);
    }
}
