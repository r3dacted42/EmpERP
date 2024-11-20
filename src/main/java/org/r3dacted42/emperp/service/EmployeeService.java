package org.r3dacted42.emperp.service;

import lombok.RequiredArgsConstructor;
import org.r3dacted42.emperp.dto.EmployeeRequest;
import org.r3dacted42.emperp.dto.EmployeeResponse;
import org.r3dacted42.emperp.entity.Employee;
import org.r3dacted42.emperp.mapper.EmployeeMapper;
import org.r3dacted42.emperp.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;

    public String createEmployee(EmployeeRequest request) {
        if (request.employeeId() != null && employeeRepository.existsById(request.employeeId())) {
            return "employee with id already exists";
        }
        Employee employee = employeeMapper.toEntity(request);
        employeeRepository.save(employee);
        return "employee created";
    }

    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll().stream().map(employeeMapper::toResponse).toList();
    }

    public EmployeeResponse getEmployeeById(long employeeId) {
        return employeeRepository.findById(employeeId).map(employeeMapper::toResponse).orElse(null);
    }

    public String updateEmployee(long employeeId, EmployeeRequest request) {
        if (!employeeRepository.existsById(employeeId)) {
            return "employee not found";
        }
        if (request.employeeId() != null && employeeRepository.existsById(request.employeeId())) {
            return "employee with new id already exists";
        }
        Employee updatedEmployee = employeeMapper.toEntity(request);
        employeeRepository.updateEmployeeByEmployeeId(employeeId, updatedEmployee);
        return "employee updated";
    }

    public String deleteEmployee(long employeeId) {
        employeeRepository.deleteById(employeeId);
        return "employee deleted";
    }
}
