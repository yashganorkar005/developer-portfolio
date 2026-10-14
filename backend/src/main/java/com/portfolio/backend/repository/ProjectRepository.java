package com.portfolio.backend.repository;

import com.portfolio.backend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByOrderBySortOrderAscIdAsc();
    List<Project> findAllByPublishedTrueOrderBySortOrderAscIdAsc();
    List<Project> findAllByPublishedTrueAndFeaturedTrueOrderBySortOrderAscIdAsc();
}
