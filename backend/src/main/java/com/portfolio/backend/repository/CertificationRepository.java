package com.portfolio.backend.repository;

import com.portfolio.backend.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findAllByOrderBySortOrderAscIdAsc();
    List<Certification> findAllByPublishedTrueOrderBySortOrderAscIdAsc();
    List<Certification> findAllByOrderByIssueDateDescSortOrderAscIdAsc();
    List<Certification> findAllByPublishedTrueOrderByIssueDateDescSortOrderAscIdAsc();
}