package org.back.back.domain.order.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.back.back.domain.customer.entity.Customer;
import org.back.back.domain.product.entity.Product;

import java.time.LocalDate;

@Entity
@Getter
@AllArgsConstructor
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

    private LocalDate deliveryDate;

    public void modify(int quantity) {
        this.quantity = quantity;
    }
}
