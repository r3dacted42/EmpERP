package org.r3dacted42.emperp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record EmployeeResponse(
        @JsonProperty("id")
        Long id,
        @JsonProperty("employee_id")
        String employeeId,
        @JsonProperty("first_name")
        String firstName,
        @JsonProperty("last_name")
        String lastName,
        @JsonProperty("email")
        String email,
        @JsonProperty("title")
        String title,
        @JsonProperty("photograph_path")
        String photographPath,
        @JsonProperty("department_id")
        Long departmentId
) {
}
