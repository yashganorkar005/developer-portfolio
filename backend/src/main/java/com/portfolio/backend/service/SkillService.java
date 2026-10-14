package com.portfolio.backend.service;

import com.portfolio.backend.dto.SkillDto;
import com.portfolio.backend.entity.Skill;
import com.portfolio.backend.entity.SkillCategoryOrder;
import com.portfolio.backend.exception.ResourceNotFoundException;
import com.portfolio.backend.repository.SkillCategoryOrderRepository;
import com.portfolio.backend.repository.SkillRepository;
import com.portfolio.backend.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;
    private final SkillCategoryOrderRepository categoryOrderRepository;

    public List<SkillDto> getAllPublished() {
        Map<String, Integer> categoryOrders = categoryOrderMap();
        return skillRepository.findAllByPublishedTrueOrderByCategoryAscSortOrderAscIdAsc()
                .stream()
                .sorted(skillComparator(categoryOrders))
                .map(this::toDto)
                .toList();
    }

    public List<SkillDto> getAll() {
        Map<String, Integer> categoryOrders = categoryOrderMap();
        return skillRepository.findAllByOrderByCategoryAscSortOrderAscIdAsc()
                .stream()
                .sorted(skillComparator(categoryOrders))
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public SkillDto create(SkillDto dto) {
        Skill entity = new Skill();
        entity.setName(dto.name());
        entity.setCategory(dto.category());
        entity.setProficiency(dto.proficiency());
        entity.setPublished(dto.published() != null && dto.published());
        entity.setSortOrder(dto.sortOrder());
        Skill saved = skillRepository.save(entity);
        if (dto.category() != null && !dto.category().isBlank()) {
            if (!categoryOrderRepository.existsById(dto.category())) {
                categoryOrderRepository.save(new SkillCategoryOrder(dto.category(), 0));
            }
        }
        return toDto(saved);
    }

    @Transactional
    public SkillDto update(Long id, SkillDto dto) {
        Skill entity = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", id));
        entity.setName(dto.name());
        entity.setCategory(dto.category());
        entity.setProficiency(dto.proficiency());
        entity.setPublished(dto.published() != null && dto.published());
        entity.setSortOrder(dto.sortOrder());
        Skill saved = skillRepository.save(entity);
        if (dto.category() != null && !dto.category().isBlank()) {
            if (!categoryOrderRepository.existsById(dto.category())) {
                categoryOrderRepository.save(new SkillCategoryOrder(dto.category(), 0));
            }
        }
        return toDto(saved);
    }

    @Transactional
    public void reorder(Long id, int newOrder) {
        Skill entity = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", id));
        entity.setSortOrder(newOrder);
        skillRepository.save(entity);
    }

    @Transactional
    public void delete(Long id) { skillRepository.deleteById(id); }

    private Map<String, Integer> categoryOrderMap() {
        Map<String, Integer> orders = new HashMap<>();
        for (SkillCategoryOrder order : categoryOrderRepository.findAllByOrderBySortOrderAscCategoryAsc()) {
            orders.put(order.getCategory(), order.getSortOrder());
        }
        return orders;
    }

    private Comparator<Skill> skillComparator(Map<String, Integer> categoryOrders) {
        return Comparator
                .comparingInt((Skill skill) -> categoryOrders.getOrDefault(skill.getCategory(), Integer.MAX_VALUE))
                .thenComparing(Skill::getCategory, Comparator.nullsLast(String::compareToIgnoreCase))
                .thenComparingInt(Skill::getSortOrder)
                .thenComparing(Skill::getId);
    }

    private SkillDto toDto(Skill e) {
        return new SkillDto(e.getId(), e.getName(), e.getCategory(),
                e.getProficiency(), e.getSortOrder(), e.isPublished(),
                DateUtil.toDate(e.getCreatedAt()), DateUtil.toDate(e.getUpdatedAt()));
    }
}