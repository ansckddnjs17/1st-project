package org.back.back.domain.admin.dto;

import org.back.back.domain.customer.entity.Customer;
import org.back.back.domain.order.entity.Order;
import org.back.back.domain.product.entity.Product;

import java.time.LocalDate;
import java.util.List;

public record GroupOrderDto (
        String email,
        String address,
        String postCode,
        List<ProductItem> productItems,
        LocalDate deliveryDate
){
    public GroupOrderDto(Order order, List<ProductItem> productItems){
        this(
                order.getCustomer().getEmail(),
                order.getCustomer().getAddress(),
                order.getCustomer().getPostcode(),
                productItems,
                order.getDeliveryDate()
        );
    }

    public record ProductItem(
            int productId,
            String productName,
            int price,
            int quantity
    ){
        public ProductItem(Order order){
            this(
                    order.getProduct().getId(),
                    order.getProduct().getName(),
                    order.getProduct().getPrice(),
                    order.getQuantity()
            );
        }
    }

}
