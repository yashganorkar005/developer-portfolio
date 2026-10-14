package com.portfolio.backend.repository;

import com.portfolio.backend.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findAllByOrderBySortOrderAscIdAsc();
    List<Education> findAllByPublishedTrueOrderBySortOrderAscIdAsc();
    List<Education> findAllByOrderByStartDateDescSortOrderAscIdAsc();
    List<Education> findAllByPublishedTrueOrderByStartDateDescSortOrderAscIdAsc();
}