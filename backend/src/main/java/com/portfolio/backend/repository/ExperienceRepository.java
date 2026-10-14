package com.portfolio.backend.repository;

import com.portfolio.backend.entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    List<Experience> findAllByOrderBySortOrderAscIdAsc();
    List<Experience> findAllByPublishedTrueOrderBySortOrderAscIdAsc();
    List<Experience> findAllByOrderByStartDateDescSortOrderAscIdAsc();
    List<Experience> findAllByPublishedTrueOrderByStartDateDescSortOrderAscIdAsc();
}