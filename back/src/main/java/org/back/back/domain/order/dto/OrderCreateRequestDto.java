package org.back.back.domain.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;

public record OrderCreateRequestDto(
    @Email @NotBlank String email,
    @NotBlank String address,
    @NotBlank String postcode,
    @NotEmpty @Valid
    List<OrderLineRequestDto> items
) {
    public record OrderLineRequestDto(
            @Min(1)
            int productId,
            @Min(1)
            int quantity
    ){}
}
