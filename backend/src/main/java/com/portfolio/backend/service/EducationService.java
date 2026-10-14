package com.portfolio.backend.service;

import com.portfolio.backend.dto.EducationDto;
import com.portfolio.backend.entity.Education;
import com.portfolio.backend.exception.ResourceNotFoundException;
import com.portfolio.backend.repository.EducationRepository;
import com.portfolio.backend.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EducationService {

    private final EducationRepository eduRepository;

    public List<EducationDto> getAllPublished() {
        return eduRepository.findAllByPublishedTrueOrderBySortOrderAscIdAsc()
                .stream().map(this::toDto).toList();
    }

    public List<EducationDto> getAll() {
        return eduRepository.findAllByOrderBySortOrderAscIdAsc()
                .stream().map(this::toDto).toList();
    }

    @Transactional
    public EducationDto create(EducationDto dto) {
        Education entity = new Education();
        entity.setInstitution(dto.institution());
        entity.setDegree(dto.degree());
        entity.setField(dto.field());
        entity.setStartDate(dto.startDate());
        entity.setEndDate(dto.endDate());
        entity.setCurrentlyEnrolled(dto.currentlyEnrolled());
        entity.setDescription(dto.description());
        entity.setPublished(dto.published() != null && dto.published());
        entity.setSortOrder(dto.sortOrder());
        return toDto(eduRepository.save(entity));
    }

    @Transactional
    public EducationDto update(Long id, EducationDto dto) {
        Education entity = eduRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Education", id));
        entity.setInstitution(dto.institution());
        entity.setDegree(dto.degree());
        entity.setField(dto.field());
        entity.setStartDate(dto.startDate());
        entity.setEndDate(dto.endDate());
        entity.setCurrentlyEnrolled(dto.currentlyEnrolled());
        entity.setDescription(dto.description());
        entity.setPublished(dto.published() != null && dto.published());
        entity.setSortOrder(dto.sortOrder());
        return toDto(eduRepository.save(entity));
    }

    @Transactional
    public void reorder(Long id, int newOrder) {
        Education entity = eduRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Education", id));
        entity.setSortOrder(newOrder);
        eduRepository.save(entity);
    }

    @Transactional
    public void delete(Long id) { eduRepository.deleteById(id); }

    private EducationDto toDto(Education e) {
        return new EducationDto(e.getId(), e.getInstitution(), e.getDegree(), e.getField(),
                e.getStartDate(), e.getEndDate(), e.isCurrentlyEnrolled(), e.getDescription(),
                e.getSortOrder(), e.isPublished(),
                DateUtil.toDate(e.getCreatedAt()), DateUtil.toDate(e.getUpdatedAt()));
    }
}