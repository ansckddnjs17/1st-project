package org.back.back.domain.order.dto;

import java.util.List;

public record OrderCreateResponseDto (
        List<OrderDto> orders,
        int totalAmount
){}
