package com.portfolio.backend.repository;

import com.portfolio.backend.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findAllByOrderBySortOrderAscIdAsc();
    List<Achievement> findAllByPublishedTrueOrderBySortOrderAscIdAsc();
}