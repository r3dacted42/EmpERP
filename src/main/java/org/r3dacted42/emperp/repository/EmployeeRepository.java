package org.r3dacted42.emperp.repository;

import org.r3dacted42.emperp.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    @Query("SELECT EXISTS (SELECT 1 FROM Employee e WHERE e.employeeId = :id)")
    public boolean existsByEmployeeId(@Param("id") String id);

    @Query("SELECT e FROM Employee e WHERE e.employeeId = :id")
    public Employee findByEmployeeId(@Param("id") String id);
}
