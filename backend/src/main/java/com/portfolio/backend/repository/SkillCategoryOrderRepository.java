package com.portfolio.backend.repository;

import com.portfolio.backend.entity.SkillCategoryOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SkillCategoryOrderRepository extends JpaRepository<SkillCategoryOrder, String> {
    List<SkillCategoryOrder> findAllByOrderBySortOrderAscCategoryAsc();
}
