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

    public String createEmployeeSalary(EmployeeSalaryRequest request) {
        if (request.id() != null && employeeSalaryRepository.existsById(request.id())) {
            return "employee salary with is already exists";
        }
        EmployeeSalary employeeSalary = employeeSalaryMapper.toEntity(request);
        employeeSalaryRepository.save(employeeSalary);
        return "employee salary created";
    }

    public List<EmployeeSalaryResponse> getAllEmployeeSalaries() {
        return employeeSalaryRepository.findAll().stream().map(employeeSalaryMapper::toResponse).toList();
    }

    public EmployeeSalaryResponse getEmployeeSalaryById(Long id) {
        return employeeSalaryRepository.findById(id).map(employeeSalaryMapper::toResponse).orElse(null);
    }

    public String updateEmployeeSalary(Long id, EmployeeSalaryRequest request) {
        if (!employeeSalaryRepository.existsById(id)) {
            return "employee salary not found";
        }
        if (request.id() != null && employeeSalaryRepository.existsById(request.id())) {
            return "employee salary with new id already exists";
        }
        EmployeeSalary updatedSalary = employeeSalaryMapper.toEntity(request);
        employeeSalaryRepository.updateEmployeeSalaryById(id, updatedSalary);
        return "employee salary updated";
    }

    public String deleteEmployeeSalary(Long id) {
        employeeRepository.deleteById(id);
        return "employee salary deleted";
    }
}
