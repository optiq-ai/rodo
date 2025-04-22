package com.rodoassessment.gdprassessmentpanel.repository;

import com.rodoassessment.gdprassessmentpanel.model.Assessment;
import com.rodoassessment.gdprassessmentpanel.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    
    List<Assessment> findByUser(User user);
    
    List<Assessment> findByUserOrderByCreatedAtDesc(User user);
    
    List<Assessment> findByStatus(String status);
}
