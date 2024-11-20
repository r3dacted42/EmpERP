package org.r3dacted42.emperp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.*;

public record EmployeeRequest(
        @JsonProperty("employee_id")
        @Nullable
        Long employeeId,

        @JsonProperty("first_name")
        @NotEmpty(message = "first name is required")
        @Size(min = 1, max = 255, message = "first name must be 1 to 255 chars long")
        String firstName,

        @JsonProperty("last_name")
        @Size(max = 255, message = "last name must be at most 255 chars long")
        String lastName,

        @JsonProperty("email")
        @NotEmpty(message = "email is required")
        @Email(message = "email must be valid")
        String email,

        @JsonProperty("title")
        @Size(max = 255, message = "title must be at most 255 chars long")
        String title,

        @JsonProperty("photograph_path")
        @Size(max = 1024, message = "photograph path must be at most 1024 chars long")
        String photographPath,

        @JsonProperty("department_id")
        @NotNull(message = "department id is required")
        Long departmentId
) {
}
