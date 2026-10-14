package com.portfolio.backend.service;

import com.portfolio.backend.dto.SocialLinkDto;
import com.portfolio.backend.entity.SocialLink;
import com.portfolio.backend.exception.ResourceNotFoundException;
import com.portfolio.backend.repository.SocialLinkRepository;
import com.portfolio.backend.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SocialLinkService {

    private final SocialLinkRepository socialLinkRepository;

    public List<SocialLinkDto> getAllPublished() {
        return socialLinkRepository.findAllByPublishedTrueOrderBySortOrderAscIdAsc()
                .stream().map(this::toDto).toList();
    }

    public List<SocialLinkDto> getAll() {
        return socialLinkRepository.findAllByOrderBySortOrderAscIdAsc()
                .stream().map(this::toDto).toList();
    }

    @Transactional
    public SocialLinkDto create(SocialLinkDto dto) {
        SocialLink entity = new SocialLink();
        entity.setPlatform(dto.platform());
        entity.setUrl(dto.url());
        entity.setIconName(dto.iconName());
        entity.setPublished(dto.published() != null && dto.published());
        entity.setSortOrder(dto.sortOrder());
        return toDto(socialLinkRepository.save(entity));
    }

    @Transactional
    public SocialLinkDto update(Long id, SocialLinkDto dto) {
        SocialLink entity = socialLinkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SocialLink", id));
        entity.setPlatform(dto.platform());
        entity.setUrl(dto.url());
        entity.setIconName(dto.iconName());
        entity.setPublished(dto.published() != null && dto.published());
        entity.setSortOrder(dto.sortOrder());
        return toDto(socialLinkRepository.save(entity));
    }

    @Transactional
    public void reorder(Long id, int newOrder) {
        SocialLink entity = socialLinkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SocialLink", id));
        entity.setSortOrder(newOrder);
        socialLinkRepository.save(entity);
    }

    @Transactional
    public void delete(Long id) { socialLinkRepository.deleteById(id); }

    private SocialLinkDto toDto(SocialLink e) {
        return new SocialLinkDto(e.getId(), e.getPlatform(), e.getUrl(), e.getIconName(),
                e.getSortOrder(), e.isPublished(),
                DateUtil.toDate(e.getCreatedAt()), DateUtil.toDate(e.getUpdatedAt()));
    }
}