package org.r3dacted42.emperp.repository;

import org.r3dacted42.emperp.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    void updateEmployeeByEmployeeId(long employeeId, Employee updatedEmployee);
}
