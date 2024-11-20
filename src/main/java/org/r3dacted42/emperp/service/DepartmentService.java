package org.r3dacted42.emperp.service;

import lombok.RequiredArgsConstructor;
import org.r3dacted42.emperp.dto.DepartmentRequest;
import org.r3dacted42.emperp.dto.DepartmentResponse;
import org.r3dacted42.emperp.entity.Department;
import org.r3dacted42.emperp.mapper.DepartmentMapper;
import org.r3dacted42.emperp.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;

    public String createDepartment(DepartmentRequest request) {
        if (request.departmentId() != null && departmentRepository.existsById(request.departmentId())) {
            return "department with id already exists";
        }
        Department department = departmentMapper.toEntity(request);
        departmentRepository.save(department);
        return "department created";
    }

    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream().map(departmentMapper::toResponse).toList();
    }

    public DepartmentResponse getDepartment(Long departmentId) {
        return departmentRepository.findById(departmentId).map(departmentMapper::toResponse).orElse(null);
    }

    public String updateDepartment(Long departmentId, DepartmentRequest request) {
        if (!departmentRepository.existsById(departmentId)) {
            return "department not found";
        }
        if (request.departmentId() != null && departmentRepository.existsById(request.departmentId())) {
            return "department with new id already exists";
        }
        Department updatedDepartment = departmentMapper.toEntity(request);
        departmentRepository.updateDepartmentByDepartmentId(departmentId, updatedDepartment);
        return "department updated";
    }

    public String deleteDepartment(Long departmentId) {
        departmentRepository.deleteById(departmentId);
        return "department deleted";
    }
}
