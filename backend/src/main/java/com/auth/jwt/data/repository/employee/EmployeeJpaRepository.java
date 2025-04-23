package com.auth.jwt.data.repository.employee;

import com.auth.jwt.data.entity.employee.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeJpaRepository extends JpaRepository<Employee, Long> {
    
    @Query("SELECT e FROM Employee e WHERE e.userName = :login")
    Employee findByLogin(@Param("login") String login);
    
    Employee findByUserName(String userName);
    
    Employee findByEmail(String email);
}
