package com.portfolio.backend.service;

import com.portfolio.backend.dto.CertificationDto;
import com.portfolio.backend.entity.Certification;
import com.portfolio.backend.exception.ResourceNotFoundException;
import com.portfolio.backend.repository.CertificationRepository;
import com.portfolio.backend.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificationService {

    private final CertificationRepository certRepository;

    public List<CertificationDto> getAllPublished() {
        return certRepository.findAllByPublishedTrueOrderBySortOrderAscIdAsc()
                .stream().map(this::toDto).toList();
    }

    public List<CertificationDto> getAll() {
        return certRepository.findAllByOrderBySortOrderAscIdAsc()
                .stream().map(this::toDto).toList();
    }

    @Transactional
    public CertificationDto create(CertificationDto dto) {
        Certification entity = new Certification();
        entity.setName(dto.name());
        entity.setIssuer(dto.issuer());
        entity.setIssueDate(dto.issueDate());
        entity.setExpiryDate(dto.expiryDate());
        entity.setCredentialUrl(dto.credentialUrl());
        entity.setImageUrl(dto.imageUrl());
        entity.setPublished(dto.published() != null && dto.published());
        entity.setSortOrder(dto.sortOrder());
        return toDto(certRepository.save(entity));
    }

    @Transactional
    public CertificationDto update(Long id, CertificationDto dto) {
        Certification entity = certRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certification", id));
        entity.setName(dto.name());
        entity.setIssuer(dto.issuer());
        entity.setIssueDate(dto.issueDate());
        entity.setExpiryDate(dto.expiryDate());
        entity.setCredentialUrl(dto.credentialUrl());
        entity.setImageUrl(dto.imageUrl());
        entity.setPublished(dto.published() != null && dto.published());
        entity.setSortOrder(dto.sortOrder());
        return toDto(certRepository.save(entity));
    }

    @Transactional
    public void reorder(Long id, int newOrder) {
        Certification entity = certRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certification", id));
        entity.setSortOrder(newOrder);
        certRepository.save(entity);
    }

    @Transactional
    public void delete(Long id) { certRepository.deleteById(id); }

    private CertificationDto toDto(Certification e) {
        return new CertificationDto(e.getId(), e.getName(), e.getIssuer(),
                e.getIssueDate(), e.getExpiryDate(), e.getCredentialUrl(), e.getImageUrl(),
                e.getSortOrder(),
                e.isPublished(),
                DateUtil.toDate(e.getCreatedAt()), DateUtil.toDate(e.getUpdatedAt()));
    }
}