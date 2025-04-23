package com.auth.jwt.data.repository;

import com.auth.jwt.data.entity.assessment.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByEmployeeId(Long employeeId);
    List<Assessment> findByEmployeeIdAndStatus(Long employeeId, String status);
    long countByEmployeeId(Long employeeId);
    long countByEmployeeIdAndStatus(Long employeeId, String status);
}
