package com.auth.jwt.data.repository;

import com.auth.jwt.data.entity.assessment.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    List<Chapter> findByAssessmentId(Long assessmentId);
}
