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

    public DepartmentResponse createDepartment(DepartmentRequest request) {
        Department department = departmentMapper.toEntity(request);
        return departmentMapper.toResponse(departmentRepository.save(department));
    }

    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream().map(departmentMapper::toResponse).toList();
    }

    public DepartmentResponse getDepartment(Long departmentId) {
        return departmentRepository.findById(departmentId).map(departmentMapper::toResponse).orElse(null);
    }

    public DepartmentResponse updateDepartment(Long departmentId, DepartmentRequest request) {
        if (!departmentRepository.existsById(departmentId)) {
            return null;
        }
        Department updatedDepartment = departmentMapper.toEntity(request);
        updatedDepartment.setDepartmentId(departmentId);
        return departmentMapper.toResponse(departmentRepository.save(updatedDepartment));
    }

    public String deleteDepartment(Long departmentId) {
        if (!departmentRepository.existsById(departmentId)) {
            return null;
        }
        departmentRepository.deleteById(departmentId);
        return "department deleted";
    }
}
