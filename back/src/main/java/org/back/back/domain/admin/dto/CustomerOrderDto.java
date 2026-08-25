package org.back.back.domain.admin.dto;

import org.back.back.domain.order.entity.Order;
import org.back.back.domain.product.entity.Product;

import java.time.LocalDate;

public record CustomerOrderDto(
        String email,
        String address,
        String postCode,
        Product product,
        Integer quantity,
        LocalDate deliveryDate
) {
    public CustomerOrderDto(Order order){
        this(
            order.getCustomer().getEmail(),
            order.getCustomer().getAddress(),
            order.getCustomer().getPostcode(),
            order.getProduct(),
            order.getQuantity(),
            order.getDeliveryDate()
        );
    }
}
