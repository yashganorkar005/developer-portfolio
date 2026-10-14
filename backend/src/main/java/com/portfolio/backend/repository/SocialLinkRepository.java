package com.portfolio.backend.repository;

import com.portfolio.backend.entity.SocialLink;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SocialLinkRepository extends JpaRepository<SocialLink, Long> {
    List<SocialLink> findAllByOrderBySortOrderAscIdAsc();
    List<SocialLink> findAllByPublishedTrueOrderBySortOrderAscIdAsc();
}