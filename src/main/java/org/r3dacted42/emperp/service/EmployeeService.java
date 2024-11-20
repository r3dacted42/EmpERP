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

    public boolean checkIfEmployeeIdAvailable(String employeeId) {
        return employeeRepository.existsByEmployeeId(employeeId);
    }

    public EmployeeResponse createEmployee(EmployeeRequest request) {
        if (employeeRepository.existsByEmployeeId(request.employeeId())) {
            return null;
        }
        Employee employee = employeeMapper.toEntity(request);
        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll().stream().map(employeeMapper::toResponse).toList();
    }

    public EmployeeResponse getEmployeeById(long employeeId) {
        return employeeRepository.findById(employeeId).map(employeeMapper::toResponse).orElse(null);
    }

    public EmployeeResponse updateEmployee(long id, EmployeeRequest request) {
        if (!employeeRepository.existsById(id)) {
            return null;
        }
        Employee updatedEmployee = employeeMapper.toEntity(request);
        updatedEmployee.setId(id);
        return employeeMapper.toResponse(employeeRepository.save(updatedEmployee));
    }

    public String deleteEmployee(long employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            return null;
        }
        employeeRepository.deleteById(employeeId);
        return "employee deleted";
    }
}