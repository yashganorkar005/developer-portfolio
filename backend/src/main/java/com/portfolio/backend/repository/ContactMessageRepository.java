package com.portfolio.backend.repository;

import com.portfolio.backend.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.Instant;
import java.util.List;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    List<ContactMessage> findAllByOrderByCreatedAtDesc();
    long countByIpAddressAndCreatedAtAfter(String ipAddress, Instant since);
}
