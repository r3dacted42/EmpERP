package org.r3dacted42.emperp.repository;

import org.r3dacted42.emperp.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
}
