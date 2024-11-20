package org.r3dacted42.emperp.repository;

import org.r3dacted42.emperp.entity.EmployeeSalary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeSalaryRepository extends JpaRepository<EmployeeSalary, Long> {
    void updateEmployeeSalaryById(Long id, EmployeeSalary employeeSalary);
}
