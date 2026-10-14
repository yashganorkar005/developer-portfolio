package com.portfolio.backend.service;

import com.portfolio.backend.dto.ExperienceDto;
import com.portfolio.backend.entity.Experience;
import com.portfolio.backend.exception.ResourceNotFoundException;
import com.portfolio.backend.repository.ExperienceRepository;
import com.portfolio.backend.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExperienceService {

    private final ExperienceRepository expRepository;

    public List<ExperienceDto> getAllPublished() {
        return expRepository.findAllByPublishedTrueOrderBySortOrderAscIdAsc()
                .stream().map(this::toDto).toList();
    }

    public List<ExperienceDto> getAll() {
        return expRepository.findAllByOrderBySortOrderAscIdAsc()
                .stream().map(this::toDto).toList();
    }

    @Transactional
    public ExperienceDto create(ExperienceDto dto) {
        Experience entity = new Experience();
        entity.setCompany(dto.company());
        entity.setRole(dto.role());
        entity.setStartDate(dto.startDate());
        entity.setEndDate(dto.endDate());
        entity.setCurrentRole(dto.currentRole());
        entity.setDescription(dto.description());
        entity.setPublished(dto.published() != null && dto.published());
        entity.setSortOrder(dto.sortOrder());
        if (dto.techStack() != null) entity.setTechStack(String.join(",", dto.techStack()));
        return toDto(expRepository.save(entity));
    }

    @Transactional
    public ExperienceDto update(Long id, ExperienceDto dto) {
        Experience entity = expRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", id));
        entity.setCompany(dto.company());
        entity.setRole(dto.role());
        entity.setStartDate(dto.startDate());
        entity.setEndDate(dto.endDate());
        entity.setCurrentRole(dto.currentRole());
        entity.setDescription(dto.description());
        entity.setPublished(dto.published() != null && dto.published());
        entity.setSortOrder(dto.sortOrder());
        if (dto.techStack() != null) entity.setTechStack(String.join(",", dto.techStack()));
        return toDto(expRepository.save(entity));
    }

    @Transactional
    public void reorder(Long id, int newOrder) {
        Experience entity = expRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", id));
        entity.setSortOrder(newOrder);
        expRepository.save(entity);
    }

    @Transactional
    public void delete(Long id) { expRepository.deleteById(id); }

    private ExperienceDto toDto(Experience e) {
        List<String> tech = (e.getTechStack() != null && !e.getTechStack().isBlank())
                ? Arrays.stream(e.getTechStack().split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .toList()
                : List.of();
        return new ExperienceDto(e.getId(), e.getCompany(), e.getRole(),
                e.getStartDate(), e.getEndDate(), e.isCurrentRole(), e.getDescription(),
                tech, e.getSortOrder(), e.isPublished(),
                DateUtil.toDate(e.getCreatedAt()), DateUtil.toDate(e.getUpdatedAt()));
    }
}