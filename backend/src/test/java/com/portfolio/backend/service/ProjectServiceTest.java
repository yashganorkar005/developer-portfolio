package com.portfolio.backend.service;

import com.portfolio.backend.dto.ProjectDto;
import com.portfolio.backend.entity.Project;
import com.portfolio.backend.repository.ProjectRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectService projectService;

    @Test
    void getAllPublishedDoesNotPromoteUnfeaturedProjects() {
        Project first = project(false, 1);
        Project second = project(false, 2);
        when(projectRepository.findAllByPublishedTrueOrderBySortOrderAscIdAsc())
                .thenReturn(List.of(first, second));

        List<ProjectDto> result = projectService.getAllPublished();

        assertEquals(2, result.size());
        assertFalse(result.get(0).featured());
        assertFalse(result.get(1).featured());
    }

    @Test
    void getFeaturedReturnsOnlyExplicitlyFeaturedProjectsInRepositoryOrder() {
        Project first = project(true, 2);
        Project second = project(true, 4);
        when(projectRepository.findAllByPublishedTrueAndFeaturedTrueOrderBySortOrderAscIdAsc())
                .thenReturn(List.of(first, second));

        List<ProjectDto> result = projectService.getFeatured();

        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(ProjectDto::featured));
        verify(projectRepository).findAllByPublishedTrueAndFeaturedTrueOrderBySortOrderAscIdAsc();
    }

    @Test
    void createWithOmittedPublishedKeepsProjectsPublished() {
        ProjectDto input = new ProjectDto(null, "Project", "Description", "Web", List.of(),
                null, null, null, false, 0, null, null, null);
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProjectDto result = projectService.create(input);

        assertTrue(result.published());
    }

    @Test
    void updateWithOmittedPublishedPreservesExistingValue() {
        Project existing = project(true, 1);
        when(projectRepository.findById(1L)).thenReturn(java.util.Optional.of(existing));
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> invocation.getArgument(0));
        ProjectDto input = new ProjectDto(1L, "Updated", "Description", "Web", List.of(),
                null, null, null, true, 3, null, null, null);

        ProjectDto result = projectService.update(1L, input);

        assertTrue(result.published());
        assertEquals(3, result.sortOrder());
    }

    private Project project(boolean featured, int sortOrder) {
        Project project = new Project();
        project.setTitle("Project");
        project.setDescription("Description");
        project.setCategory("Web");
        project.setFeatured(featured);
        project.setPublished(true);
        project.setSortOrder(sortOrder);
        return project;
    }
}
