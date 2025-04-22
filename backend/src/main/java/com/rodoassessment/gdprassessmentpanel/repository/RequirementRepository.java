package com.rodoassessment.gdprassessmentpanel.repository;

import com.rodoassessment.gdprassessmentpanel.model.Area;
import com.rodoassessment.gdprassessmentpanel.model.Requirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequirementRepository extends JpaRepository<Requirement, Long> {
    
    List<Requirement> findByArea(Area area);
    
    List<Requirement> findByAreaOrderByOrderNumberAsc(Area area);
}
