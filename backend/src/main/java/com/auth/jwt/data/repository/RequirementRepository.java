package com.auth.jwt.data.repository;

import com.auth.jwt.data.entity.assessment.Requirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequirementRepository extends JpaRepository<Requirement, Long> {
    List<Requirement> findByAreaId(Long areaId);
}
