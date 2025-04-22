package com.rodoassessment.gdprassessmentpanel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentDto {
    private Long id;
    private String name;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ChapterDto> chapters = new ArrayList<>();
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChapterDto {
        private Long id;
        private String name;
        private String description;
        private Integer orderNumber;
        private List<AreaDto> areas = new ArrayList<>();
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AreaDto {
        private Long id;
        private String name;
        private String description;
        private Integer orderNumber;
        private String score;
        private String comment;
        private List<RequirementDto> requirements = new ArrayList<>();
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RequirementDto {
        private Long id;
        private String text;
        private Integer orderNumber;
        private String value;
        private String comment;
    }
}
