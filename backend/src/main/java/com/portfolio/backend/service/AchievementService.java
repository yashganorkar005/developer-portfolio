package com.portfolio.backend.service;

import com.portfolio.backend.dto.AchievementDto;
import com.portfolio.backend.entity.Achievement;
import com.portfolio.backend.exception.ResourceNotFoundException;
import com.portfolio.backend.repository.AchievementRepository;
import com.portfolio.backend.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AchievementService {

    private final AchievementRepository achRepository;

    public List<AchievementDto> getAllPublished() {
        return achRepository.findAllByPublishedTrueOrderBySortOrderAscIdAsc()
                .stream().map(this::toDto).toList();
    }

    public List<AchievementDto> getAll() {
        return achRepository.findAllByOrderBySortOrderAscIdAsc()
                .stream().map(this::toDto).toList();
    }

    @Transactional
    public AchievementDto create(AchievementDto dto) {
        Achievement entity = new Achievement();
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setDate(dto.date());
        entity.setImageUrl(dto.imageUrl());
        entity.setPublished(dto.published() != null && dto.published());
        entity.setSortOrder(dto.sortOrder());
        return toDto(achRepository.save(entity));
    }

    @Transactional
    public AchievementDto update(Long id, AchievementDto dto) {
        Achievement entity = achRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement", id));
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setDate(dto.date());
        entity.setImageUrl(dto.imageUrl());
        entity.setPublished(dto.published() != null && dto.published());
        entity.setSortOrder(dto.sortOrder());
        return toDto(achRepository.save(entity));
    }

    @Transactional
    public void reorder(Long id, int newOrder) {
        Achievement entity = achRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement", id));
        entity.setSortOrder(newOrder);
        achRepository.save(entity);
    }

    @Transactional
    public void delete(Long id) { achRepository.deleteById(id); }

    private AchievementDto toDto(Achievement e) {
        return new AchievementDto(e.getId(), e.getTitle(), e.getDescription(), e.getDate(),
                e.getImageUrl(),
                e.getSortOrder(), e.isPublished(),
                DateUtil.toDate(e.getCreatedAt()), DateUtil.toDate(e.getUpdatedAt()));
    }
}