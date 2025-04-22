package com.rodoassessment.gdprassessmentpanel.repository;

import com.rodoassessment.gdprassessmentpanel.model.Area;
import com.rodoassessment.gdprassessmentpanel.model.AreaScore;
import com.rodoassessment.gdprassessmentpanel.model.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AreaScoreRepository extends JpaRepository<AreaScore, Long> {
    
    List<AreaScore> findByAssessment(Assessment assessment);
    
    List<AreaScore> findByArea(Area area);
    
    Optional<AreaScore> findByAssessmentIdAndAreaId(Long assessmentId, Long areaId);
    
    List<AreaScore> findByScore(String score);
}
