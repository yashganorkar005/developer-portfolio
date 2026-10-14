package com.portfolio.backend.service;

import com.portfolio.backend.entity.ContactMessage;
import com.portfolio.backend.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository repo;

    @Transactional
    public ContactMessage save(ContactMessage message) {
        return repo.save(message);
    }

    public List<ContactMessage> findAll() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    public Optional<ContactMessage> findById(Long id) {
        return repo.findById(id);
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }

    public boolean isRateLimited(String ip, int maxPerHour) {
        return repo.countByIpAddressAndCreatedAtAfter(ip, Instant.now().minusSeconds(3600)) >= maxPerHour;
    }
}