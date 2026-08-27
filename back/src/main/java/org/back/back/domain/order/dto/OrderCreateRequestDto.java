package org.back.back.domain.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;

public record OrderCreateRequestDto(
    @Email @NotBlank String email,
    @NotBlank String address,
    @NotBlank(message = "우편번호는 필수입니다.")
    @Pattern(
            regexp = "^\\d{5}$",
            message = "우편번호는 숫자 5자리여야 합니다."
    )
    String postcode,
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
