package org.back.back.domain.order.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.back.back.domain.customer.entity.Customer;
import org.back.back.domain.product.entity.Product;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
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
    private LocalDateTime createdDate;

    private LocalDate deliveryDate;

    public Order(
            Customer customer,
            Product product,
            int quantity,
            LocalDate deliveryDate
    ) {
        this.customer = customer;
        this.product = product;
        this.quantity = quantity;
        this.deliveryDate = deliveryDate;
    }
}
