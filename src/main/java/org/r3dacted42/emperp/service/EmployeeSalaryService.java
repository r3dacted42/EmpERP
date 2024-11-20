package org.r3dacted42.emperp.service;

import lombok.RequiredArgsConstructor;
import org.r3dacted42.emperp.dto.EmployeeSalaryRequest;
import org.r3dacted42.emperp.dto.EmployeeSalaryResponse;
import org.r3dacted42.emperp.entity.EmployeeSalary;
import org.r3dacted42.emperp.mapper.EmployeeSalaryMapper;
import org.r3dacted42.emperp.repository.EmployeeRepository;
import org.r3dacted42.emperp.repository.EmployeeSalaryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeSalaryService {
    private final EmployeeSalaryRepository employeeSalaryRepository;
    private final EmployeeSalaryMapper employeeSalaryMapper;
    private final EmployeeRepository employeeRepository;

    public EmployeeSalaryResponse createEmployeeSalary(EmployeeSalaryRequest request) {
        EmployeeSalary employeeSalary = employeeSalaryMapper.toEntity(request);
        return employeeSalaryMapper.toResponse(employeeSalaryRepository.save(employeeSalary));
    }

    public List<EmployeeSalaryResponse> getAllEmployeeSalaries() {
        return employeeSalaryRepository.findAll().stream().map(employeeSalaryMapper::toResponse).toList();
    }

    public EmployeeSalaryResponse getEmployeeSalary(Long id) {
        return employeeSalaryRepository.findById(id).map(employeeSalaryMapper::toResponse).orElse(null);
    }

    public EmployeeSalaryResponse updateEmployeeSalary(Long id, EmployeeSalaryRequest request) {
        if (!employeeSalaryRepository.existsById(id)) {
            return null;
        }
        EmployeeSalary updatedSalary = employeeSalaryMapper.toEntity(request);
        updatedSalary.setId(id);
        return employeeSalaryMapper.toResponse(employeeSalaryRepository.save(updatedSalary));
    }

    public String deleteEmployeeSalary(Long id) {
        if (!employeeSalaryRepository.existsById(id)) {
            return null;
        }
        employeeRepository.deleteById(id);
        return "employee salary deleted";
    }
}
