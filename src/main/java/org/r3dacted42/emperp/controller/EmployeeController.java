package org.r3dacted42.emperp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.r3dacted42.emperp.dto.EmployeeRequest;
import org.r3dacted42.emperp.dto.EmployeeResponse;
import org.r3dacted42.emperp.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable String employeeId) {
        EmployeeResponse res = employeeService.getEmployeeByEmployeeId(employeeId.trim());
        if (res == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(res);
    }

    @GetMapping("/available")
    public ResponseEntity<Boolean> checkIfEmployeeIdAvailable(@RequestParam(value = "id") String employeeId) {
        return ResponseEntity.ok(employeeService.checkIfEmployeeIdAvailable(employeeId.trim()));
    }

    @GetMapping("/photo/{employeeId}")
    public ResponseEntity<byte[]> getEmployeePhoto(@PathVariable String employeeId) throws IOException {
        Path path = employeeService.getEmployeePhotoPath(employeeId.trim());
        if (path == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(Files.readAllBytes(path));
    }

    @PostMapping
    public ResponseEntity<Object> createEmployee(@RequestBody @Valid EmployeeRequest employeeRequest) {
        Object res = employeeService.createEmployee(employeeRequest);
        // department not found or employee id already taken
        if (res.getClass() == String.class) return ResponseEntity.badRequest().body(res);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{employeeId}")
                .buildAndExpand(((EmployeeResponse) res).employeeId())
                .toUri();
        return ResponseEntity.created(location).body(res);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Object> updateEmployee(@PathVariable Long id, @RequestBody @Valid EmployeeRequest employeeRequest) {
        Object res = employeeService.updateEmployee(id, employeeRequest);
        if (res == null) return ResponseEntity.notFound().build();
        // employee id already taken
        if (res.getClass() == String.class) return ResponseEntity.badRequest().body(res);
        return ResponseEntity.ok(res);
    }

    @PatchMapping("/photo/{id}")
    public ResponseEntity<Object> updateEmployeePhoto(@PathVariable Long id, @RequestBody MultipartFile photo) throws IOException {
        String res = employeeService.updateEmployeePhoto(id, photo);
        if (res == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long id) {
        String res = employeeService.deleteEmployee(id);
        if (res == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(res);
    }
}
