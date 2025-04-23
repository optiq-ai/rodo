package com.auth.jwt.data.repository;

import com.auth.jwt.data.entity.report.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByEmployeeId(Long employeeId);
    List<Report> findByEmployeeIdAndReportType(Long employeeId, String reportType);
}
