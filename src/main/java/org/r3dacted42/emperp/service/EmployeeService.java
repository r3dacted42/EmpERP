package org.r3dacted42.emperp.service;

import lombok.RequiredArgsConstructor;
import org.r3dacted42.emperp.dto.EmployeeRequest;
import org.r3dacted42.emperp.dto.EmployeeResponse;
import org.r3dacted42.emperp.entity.Department;
import org.r3dacted42.emperp.entity.Employee;
import org.r3dacted42.emperp.mapper.EmployeeMapper;
import org.r3dacted42.emperp.repository.DepartmentRepository;
import org.r3dacted42.emperp.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;
    private final DepartmentRepository departmentRepository;

    public boolean checkIfEmployeeIdAvailable(String employeeId) {
        return !employeeRepository.existsByEmployeeId(employeeId);
    }

    public Object createEmployee(EmployeeRequest request) {
        if (employeeRepository.existsByEmployeeId(request.employeeId())) {
            return "employee id taken";
        }
        Department department = departmentRepository.findById(request.departmentId()).orElse(null);
        if (department == null) {
            return "department not found";
        }
        if (departmentRepository.getEmployeeCount(request.departmentId()) >= department.getCapacity()) {
            return "department capacity full";
        }
        Employee employee = employeeMapper.toEntity(request);
        employee.setDepartment(department);
        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll().stream().map(employeeMapper::toResponse).toList();
    }

    public EmployeeResponse getEmployeeByEmployeeId(String employeeId) {
        return employeeRepository.findByEmployeeId(employeeId).map(employeeMapper::toResponse).orElse(null);
    }

    public Object updateEmployee(long id, EmployeeRequest request) {
        if (!employeeRepository.existsById(id)) {
            return null;
        }
        Employee employee = employeeRepository.findById(id).orElse(null);
        if (employee != null && !Objects.equals(employee.getEmployeeId(), request.employeeId())
                && employeeRepository.existsByEmployeeId(request.employeeId())) {
            return "employee id taken";
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
