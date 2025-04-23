package com.auth.jwt.data.repository;

import com.auth.jwt.data.entity.report.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByReportId(Long reportId);
    List<Recommendation> findByReportIdAndPriority(Long reportId, String priority);
    List<Recommendation> findByReportIdAndStatus(Long reportId, String status);
}
