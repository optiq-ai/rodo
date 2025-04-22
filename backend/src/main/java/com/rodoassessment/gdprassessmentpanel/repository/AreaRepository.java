package com.rodoassessment.gdprassessmentpanel.repository;

import com.rodoassessment.gdprassessmentpanel.model.Area;
import com.rodoassessment.gdprassessmentpanel.model.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {
    
    List<Area> findByChapter(Chapter chapter);
    
    List<Area> findByChapterOrderByOrderNumberAsc(Chapter chapter);
}
