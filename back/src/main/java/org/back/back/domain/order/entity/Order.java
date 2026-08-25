package org.back.back.domain.order.entity;

import jakarta.persistence.*;
import lombok.Getter;
import org.back.back.domain.customer.entity.Customer;
import org.back.back.domain.product.entity.Product;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Getter
public class Order {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch=FetchType.LAZY)
    private Customer customer;

    @ManyToOne(fetch=FetchType.LAZY)
    private Product product;

    private int quantity;

    @CreatedDate
    private LocalDateTime deliveryDate;
}
