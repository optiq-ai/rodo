package com.rodoassessment.gdprassessmentpanel.repository;

import com.rodoassessment.gdprassessmentpanel.model.Assessment;
import com.rodoassessment.gdprassessmentpanel.model.Requirement;
import com.rodoassessment.gdprassessmentpanel.model.Response;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Long> {
    
    List<Response> findByAssessment(Assessment assessment);
    
    List<Response> findByAssessmentAndRequirement(Assessment assessment, Requirement requirement);
    
    Optional<Response> findByAssessmentIdAndRequirementId(Long assessmentId, Long requirementId);
}
