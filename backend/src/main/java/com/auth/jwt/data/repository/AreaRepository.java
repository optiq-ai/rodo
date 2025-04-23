package com.auth.jwt.data.repository;

import com.auth.jwt.data.entity.assessment.Area;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {
    List<Area> findByChapterId(Long chapterId);
}
