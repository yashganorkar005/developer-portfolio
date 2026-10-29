package com.portfolio.backend.service;

import com.portfolio.backend.dto.ProjectDto;
import com.portfolio.backend.entity.Project;
import com.portfolio.backend.exception.ResourceNotFoundException;
import com.portfolio.backend.repository.ProjectRepository;
import com.portfolio.backend.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<ProjectDto> getAllPublished() {
        return projectRepository.findAllByPublishedTrueOrderBySortOrderAscIdAsc()
                .stream().map(this::toDto).toList();
    }

    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll()
                .stream().map(this::toDto).toList();
    }

    public List<ProjectDto> getFeatured() {
        return projectRepository.findAllByPublishedTrueAndFeaturedTrueOrderBySortOrderAscIdAsc()
                .stream().map(this::toDto).toList();
    }

    public ProjectDto getById(Long id) {
        return projectRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
    }

    @Transactional
    public ProjectDto create(ProjectDto dto) {
        Project entity = new Project();
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setCategory(dto.category());
        entity.setTechStack(dto.techStack() != null ? String.join(",", dto.techStack()) : "");
        entity.setGithubUrl(dto.githubUrl());
        entity.setLiveUrl(dto.liveUrl());
        entity.setImageUrl(dto.imageUrl());
        entity.setFeatured(dto.featured());
        entity.setPublished(dto.published() == null || dto.published());
        entity.setSortOrder(dto.sortOrder());
        return toDto(projectRepository.save(entity));
    }

    @Transactional
    public ProjectDto update(Long id, ProjectDto dto) {
        Project entity = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setCategory(dto.category());
        entity.setTechStack(dto.techStack() != null ? String.join(",", dto.techStack()) : "");
        entity.setGithubUrl(dto.githubUrl());
        entity.setLiveUrl(dto.liveUrl());
        entity.setImageUrl(dto.imageUrl());
        entity.setFeatured(dto.featured());
        if (dto.published() != null) entity.setPublished(dto.published());
        entity.setSortOrder(dto.sortOrder());
        return toDto(projectRepository.save(entity));
    }

    @Transactional
    public void reorder(Long id, int newOrder) {
        Project entity = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        entity.setSortOrder(newOrder);
        projectRepository.save(entity);
    }

    @Transactional
    public void delete(Long id) { projectRepository.deleteById(id); }

    private ProjectDto toDto(Project e) {
        List<String> tech = (e.getTechStack() != null && !e.getTechStack().isBlank())
                ? Arrays.stream(e.getTechStack().split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .toList()
                : List.of();
        return new ProjectDto(e.getId(), e.getTitle(), e.getDescription(), e.getCategory(),
                tech, e.getGithubUrl(), e.getLiveUrl(), e.getImageUrl(),
                e.isFeatured(), e.getSortOrder(), e.isPublished(),
                DateUtil.toDate(e.getCreatedAt()), DateUtil.toDate(e.getUpdatedAt()));
    }
}