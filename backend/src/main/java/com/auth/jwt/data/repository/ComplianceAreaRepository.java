package com.auth.jwt.data.repository;

import com.auth.jwt.data.entity.report.ComplianceArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplianceAreaRepository extends JpaRepository<ComplianceArea, Long> {
    List<ComplianceArea> findByReportId(Long reportId);
}
