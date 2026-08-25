package org.back.back.domain.admin.dto;

import java.time.LocalDate;

public record OrderDto(
        String email,
        String address,
        String postCode,
        Integer productId,
        Integer quantity,
        LocalDate deliveryDate
) {

}
