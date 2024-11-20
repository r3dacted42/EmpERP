package org.r3dacted42.emperp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Date;

public record EmployeeSalaryRequest(
        @JsonProperty("id")
        @Nullable
        Long id,

        @JsonProperty("employee_id")
        @NotNull(message = "employee id is required")
        Long employeeId,

        @JsonProperty("payment_date")
        @NotNull(message = "payment date is required")
        Date paymentDate,

        @JsonProperty("amount")
        @NotNull(message = "salary amount is required")
        Double amount,

        @JsonProperty("description")
        @Size(max = 255, message = "description must be at most 255 chars long")
        String description
) {
}
