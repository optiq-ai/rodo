package com.rodoassessment.gdprassessmentpanel.controller;

import com.rodoassessment.gdprassessmentpanel.dto.AssessmentDto;
import com.rodoassessment.gdprassessmentpanel.dto.MessageResponse;
import com.rodoassessment.gdprassessmentpanel.model.*;
import com.rodoassessment.gdprassessmentpanel.repository.*;
import com.rodoassessment.gdprassessmentpanel.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private AreaRepository areaRepository;

    @Autowired
    private RequirementRepository requirementRepository;

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private AreaScoreRepository areaScoreRepository;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<AssessmentDto>> getAllAssessments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        
        List<Assessment> assessments = assessmentRepository.findByUserOrderByCreatedAtDesc(user);
        List<AssessmentDto> assessmentDtos = assessments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(assessmentDtos);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getAssessment(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Assessment not found."));
        
        // Check if the assessment belongs to the current user
        if (!assessment.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: You don't have permission to access this assessment."));
        }
        
        return ResponseEntity.ok(convertToDto(assessment));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createAssessment(@RequestBody AssessmentDto assessmentDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        
        Assessment assessment = new Assessment();
        assessment.setName(assessmentDto.getName());
        assessment.setDescription(assessmentDto.getDescription());
        assessment.setStatus("DRAFT");
        assessment.setUser(user);
        
        Assessment savedAssessment = assessmentRepository.save(assessment);
        
        // Process responses and area scores if provided
        if (assessmentDto.getChapters() != null) {
            for (AssessmentDto.ChapterDto chapterDto : assessmentDto.getChapters()) {
                if (chapterDto.getAreas() != null) {
                    for (AssessmentDto.AreaDto areaDto : chapterDto.getAreas()) {
                        // Save area score if provided
                        if (areaDto.getScore() != null && !areaDto.getScore().isEmpty()) {
                            Optional<Area> areaOpt = areaRepository.findById(areaDto.getId());
                            if (areaOpt.isPresent()) {
                                AreaScore areaScore = new AreaScore();
                                areaScore.setAssessment(savedAssessment);
                                areaScore.setArea(areaOpt.get());
                                areaScore.setScore(areaDto.getScore());
                                areaScore.setComment(areaDto.getComment());
                                areaScoreRepository.save(areaScore);
                            }
                        }
                        
                        // Save responses if provided
                        if (areaDto.getRequirements() != null) {
                            for (AssessmentDto.RequirementDto reqDto : areaDto.getRequirements()) {
                                if (reqDto.getValue() != null && !reqDto.getValue().isEmpty()) {
                                    Optional<Requirement> reqOpt = requirementRepository.findById(reqDto.getId());
                                    if (reqOpt.isPresent()) {
                                        Response response = new Response();
                                        response.setAssessment(savedAssessment);
                                        response.setRequirement(reqOpt.get());
                                        response.setValue(reqDto.getValue());
                                        response.setComment(reqDto.getComment());
                                        responseRepository.save(response);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        return ResponseEntity.ok(convertToDto(savedAssessment));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateAssessment(@PathVariable Long id, @RequestBody AssessmentDto assessmentDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Assessment not found."));
        
        // Check if the assessment belongs to the current user
        if (!assessment.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: You don't have permission to update this assessment."));
        }
        
        assessment.setName(assessmentDto.getName());
        assessment.setDescription(assessmentDto.getDescription());
        assessment.setStatus(assessmentDto.getStatus());
        
        Assessment savedAssessment = assessmentRepository.save(assessment);
        
        // Process responses and area scores if provided
        if (assessmentDto.getChapters() != null) {
            for (AssessmentDto.ChapterDto chapterDto : assessmentDto.getChapters()) {
                if (chapterDto.getAreas() != null) {
                    for (AssessmentDto.AreaDto areaDto : chapterDto.getAreas()) {
                        // Update area score if provided
                        if (areaDto.getScore() != null) {
                            Optional<Area> areaOpt = areaRepository.findById(areaDto.getId());
                            if (areaOpt.isPresent()) {
                                Optional<AreaScore> areaScoreOpt = areaScoreRepository.findByAssessmentIdAndAreaId(id, areaDto.getId());
                                AreaScore areaScore;
                                if (areaScoreOpt.isPresent()) {
                                    areaScore = areaScoreOpt.get();
                                } else {
                                    areaScore = new AreaScore();
                                    areaScore.setAssessment(savedAssessment);
                                    areaScore.setArea(areaOpt.get());
                                }
                                areaScore.setScore(areaDto.getScore());
                                areaScore.setComment(areaDto.getComment());
                                areaScoreRepository.save(areaScore);
                            }
                        }
                        
                        // Update responses if provided
                        if (areaDto.getRequirements() != null) {
                            for (AssessmentDto.RequirementDto reqDto : areaDto.getRequirements()) {
                                if (reqDto.getValue() != null) {
                                    Optional<Requirement> reqOpt = requirementRepository.findById(reqDto.getId());
                                    if (reqOpt.isPresent()) {
                                        Optional<Response> responseOpt = responseRepository.findByAssessmentIdAndRequirementId(id, reqDto.getId());
                                        Response response;
                                        if (responseOpt.isPresent()) {
                                            response = responseOpt.get();
                                        } else {
                                            response = new Response();
                                            response.setAssessment(savedAssessment);
                                            response.setRequirement(reqOpt.get());
                                        }
                                        response.setValue(reqDto.getValue());
                                        response.setComment(reqDto.getComment());
                                        responseRepository.save(response);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        return ResponseEntity.ok(convertToDto(savedAssessment));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteAssessment(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Assessment not found."));
        
        // Check if the assessment belongs to the current user
        if (!assessment.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: You don't have permission to delete this assessment."));
        }
        
        assessmentRepository.delete(assessment);
        
        return ResponseEntity.ok(new MessageResponse("Assessment deleted successfully!"));
    }

    @GetMapping("/template")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<AssessmentDto> getAssessmentTemplate() {
        List<Chapter> chapters = chapterRepository.findAllByOrderByOrderNumberAsc();
        
        AssessmentDto template = new AssessmentDto();
        template.setId(null);
        template.setName("");
        template.setDescription("");
        template.setStatus("DRAFT");
        
        List<AssessmentDto.ChapterDto> chapterDtos = new ArrayList<>();
        for (Chapter chapter : chapters) {
            AssessmentDto.ChapterDto chapterDto = new AssessmentDto.ChapterDto();
            chapterDto.setId(chapter.getId());
            chapterDto.setName(chapter.getName());
            chapterDto.setDescription(chapter.getDescription());
            chapterDto.setOrderNumber(chapter.getOrderNumber());
            
            List<Area> areas = areaRepository.findByChapterOrderByOrderNumberAsc(chapter);
            List<AssessmentDto.AreaDto> areaDtos = new ArrayList<>();
            
            for (Area area : areas) {
                AssessmentDto.AreaDto areaDto = new AssessmentDto.AreaDto();
                areaDto.setId(area.getId());
                areaDto.setName(area.getName());
                areaDto.setDescription(area.getDescription());
                areaDto.setOrderNumber(area.getOrderNumber());
                areaDto.setScore("");
                areaDto.setComment("");
                
                List<Requirement> requirements = requirementRepository.findByAreaOrderByOrderNumberAsc(area);
                List<AssessmentDto.RequirementDto> reqDtos = new ArrayList<>();
                
                for (Requirement req : requirements) {
                    AssessmentDto.RequirementDto reqDto = new AssessmentDto.RequirementDto();
                    reqDto.setId(req.getId());
                    reqDto.setText(req.getText());
                    reqDto.setOrderNumber(req.getOrderNumber());
                    reqDto.setValue("");
                    reqDto.setComment("");
                    reqDtos.add(reqDto);
                }
                
                areaDto.setRequirements(reqDtos);
                areaDtos.add(areaDto);
            }
            
            chapterDto.setAreas(areaDtos);
            chapterDtos.add(chapterDto);
        }
        
        template.setChapters(chapterDtos);
        
        return ResponseEntity.ok(template);
    }

    private AssessmentDto convertToDto(Assessment assessment) {
        AssessmentDto dto = new AssessmentDto();
        dto.setId(assessment.getId());
        dto.setName(assessment.getName());
        dto.setDescription(assessment.getDescription());
        dto.setStatus(assessment.getStatus());
        dto.setCreatedAt(assessment.getCreatedAt());
        dto.setUpdatedAt(assessment.getUpdatedAt());
        
        List<Chapter> chapters = chapterRepository.findAllByOrderByOrderNumberAsc();
        List<AssessmentDto.ChapterDto> chapterDtos = new ArrayList<>();
        
        for (Chapter chapter : chapters) {
            AssessmentDto.ChapterDto chapterDto = new AssessmentDto.ChapterDto();
            chapterDto.setId(chapter.getId());
            chapterDto.setName(chapter.getName());
            chapterDto.setDescription(chapter.getDescription());
            chapterDto.setOrderNumber(chapter.getOrderNumber());
            
            List<Area> areas = areaRepository.findByChapterOrderByOrderNumberAsc(chapter);
            List<AssessmentDto.AreaDto> areaDtos = new ArrayList<>();
            
            for (Area area : areas) {
                AssessmentDto.AreaDto areaDto = new AssessmentDto.AreaDto();
                areaDto.setId(area.getId());
                areaDto.setName(area.getName());
                areaDto.setDescription(area.getDescription());
                areaDto.setOrderNumber(area.getOrderNumber());
                
                // Get area score if exists
                Optional<AreaScore> areaScoreOpt = areaScoreRepository.findByAssessmentIdAndAreaId(assessment.getId(), area.getId());
                if (areaScoreOpt.isPresent()) {
                    AreaScore areaScore = areaScoreOpt.get();
                    areaDto.setScore(areaScore.getScore());
                    areaDto.setComment(areaScore.getComment());
                } else {
                    areaDto.setScore("");
                    areaDto.setComment("");
                }
                
                List<Requirement> requirements = requirementRepository.findByAreaOrderByOrderNumberAsc(area);
                List<AssessmentDto.RequirementDto> reqDtos = new ArrayList<>();
                
                for (Requirement req : requirements) {
                    AssessmentDto.RequirementDto reqDto = new AssessmentDto.RequirementDto();
                    reqDto.setId(req.getId());
                    reqDto.setText(req.getText());
                    reqDto.setOrderNumber(req.getOrderNumber());
                    
                    // Get response if exists
                    Optional<Response> responseOpt = responseRepository.findByAssessmentIdAndRequirementId(assessment.getId(), req.getId());
                    if (responseOpt.isPresent()) {
                        Response response = responseOpt.get();
                        reqDto.setValue(response.getValue());
                        reqDto.setComment(response.getComment());
                    } else {
                        reqDto.setValue("");
                        reqDto.setComment("");
                    }
                    
                    reqDtos.add(reqDto);
                }
                
                areaDto.setRequirements(reqDtos);
                areaDtos.add(areaDto);
            }
            
            chapterDto.setAreas(areaDtos);
            chapterDtos.add(chapterDto);
        }
        
        dto.setChapters(chapterDtos);
        
        return dto;
    }
}
