package org.back.back.domain.order.dto;

import org.back.back.domain.order.entity.Order;

import java.time.LocalDate;

public record OrderDto(
        int id,
        int customerId,
        int productId,
        int quantity,
        LocalDate deliveryDate,
        int price
) {
    public OrderDto(Order order){
        this(
                order.getId(),
                order.getCustomer().getId(),
                order.getProduct().getId(),
                order.getQuantity(),
                order.getDeliveryDate(),
                order.getProduct().getPrice()
        );
    }
}
