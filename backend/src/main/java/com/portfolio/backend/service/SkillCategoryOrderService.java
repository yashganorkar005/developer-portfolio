package com.portfolio.backend.service;

import com.portfolio.backend.dto.SkillCategoryOrderDto;
import com.portfolio.backend.entity.SkillCategoryOrder;
import com.portfolio.backend.exception.ResourceNotFoundException;
import com.portfolio.backend.repository.SkillCategoryOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillCategoryOrderService {

    private final SkillCategoryOrderRepository repository;

    public List<SkillCategoryOrderDto> getAll() {
        return repository.findAllByOrderBySortOrderAscCategoryAsc()
                .stream().map(e -> new SkillCategoryOrderDto(e.getCategory(), e.getSortOrder())).toList();
    }

    @Transactional
    public void reorder(String category, int newOrder) {
        SkillCategoryOrder entity = repository.findById(category)
                .orElseThrow(() -> new ResourceNotFoundException("SkillCategoryOrder", category));
        entity.setSortOrder(newOrder);
        repository.save(entity);
    }
}
