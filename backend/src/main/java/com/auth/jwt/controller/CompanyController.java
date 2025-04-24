package com.auth.jwt.controller;

import com.auth.jwt.data.dto.company.CompanyDto;
import com.auth.jwt.data.entity.company.Company;
import com.auth.jwt.data.entity.employee.Employee;
import com.auth.jwt.data.repository.CompanyRepository;
import com.auth.jwt.data.repository.employee.EmployeeJpaRepository;
import com.auth.jwt.security.UserAuthProviderParam;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class CompanyController {

    private final EmployeeJpaRepository employeeRepository;
    private final CompanyRepository companyRepository;
    private final UserAuthProviderParam userAuthProviderParam;

    @Autowired
    public CompanyController(EmployeeJpaRepository employeeRepository, 
                             CompanyRepository companyRepository,
                             UserAuthProviderParam userAuthProviderParam) {
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;
        this.userAuthProviderParam = userAuthProviderParam;
    }

    /**
     * Get the current authenticated user from token parameter
     * @param token JWT token
     * @return Employee object or null
     */
    private Employee getUserFromToken(String token) {
        try {
            Authentication authentication = userAuthProviderParam.validateToken(token);
            if (authentication != null && authentication.getName() != null) {
                return employeeRepository.findByLogin(authentication.getName());
            }
        } catch (Exception e) {
            // Token validation failed
        }
        return null;
    }

    /**
     * Get the current authenticated user
     * @return Employee object or null
     */
    private Employee getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getName() != null) {
            return employeeRepository.findByLogin(authentication.getName());
        }
        return null;
    }

    /**
     * Get company information for the current user
     * @param token JWT token (optional)
     * @return ResponseEntity with company data
     */
    @GetMapping("/company")
    public ResponseEntity<?> getCompanyInfo(@RequestParam(required = false) String token) {
        Employee employee = token != null ? getUserFromToken(token) : getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        Optional<Company> companyOpt = companyRepository.findByEmployeeId(employee.getId());
        
        if (companyOpt.isPresent()) {
            Company company = companyOpt.get();
            CompanyDto companyDto = new CompanyDto(
                company.getId(),
                company.getName(),
                company.getAddress(),
                company.getCity(),
                company.getPostalCode(),
                company.getNip(),
                company.getRegon(),
                company.getIndustry()
            );
            return ResponseEntity.ok(companyDto);
        } else {
            // Return empty company data if not found
            return ResponseEntity.ok(new CompanyDto());
        }
    }

    /**
     * Update company information for the current user
     * @param companyDto Company data to update
     * @param token JWT token (optional)
     * @return ResponseEntity with success or error message
     */
    @PutMapping("/company")
    public ResponseEntity<?> updateCompanyInfo(@Valid @RequestBody CompanyDto companyDto,
                                              @RequestParam(required = false) String token) {
        Employee employee = token != null ? getUserFromToken(token) : getCurrentUser();
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Nieautoryzowany dostęp"));
        }

        try {
            Optional<Company> companyOpt = companyRepository.findByEmployeeId(employee.getId());
            Company company;
            
            if (companyOpt.isPresent()) {
                company = companyOpt.get();
                updateCompanyFromDto(company, companyDto);
            } else {
                company = new Company(
                    companyDto.getName(),
                    companyDto.getAddress(),
                    companyDto.getCity(),
                    companyDto.getPostalCode(),
                    companyDto.getNip(),
                    companyDto.getRegon(),
                    companyDto.getIndustry(),
                    employee
                );
            }
            
            companyRepository.save(company);
            
            return ResponseEntity.ok(createSuccessResponse("Dane firmy zostały zaktualizowane"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Wystąpił błąd podczas aktualizacji danych firmy: " + e.getMessage()));
        }
    }
    
    /**
     * Update company entity from DTO
     * @param company Company entity to update
     * @param companyDto DTO with new data
     */
    private void updateCompanyFromDto(Company company, CompanyDto companyDto) {
        company.setName(companyDto.getName());
        company.setAddress(companyDto.getAddress());
        company.setCity(companyDto.getCity());
        company.setPostalCode(companyDto.getPostalCode());
        company.setNip(companyDto.getNip());
        company.setRegon(companyDto.getRegon());
        company.setIndustry(companyDto.getIndustry());
    }

    /**
     * Create a success response
     * @param message Success message
     * @return Map with success status and message
     */
    private Map<String, Object> createSuccessResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        return response;
    }

    /**
     * Create an error response
     * @param message Error message
     * @return Map with error status and message
     */
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
}
