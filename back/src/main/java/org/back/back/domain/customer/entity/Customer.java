package org.back.back.domain.customer.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.back.back.domain.order.entity.Order;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String postcode;

    public Customer(String email, String address, String postcode) {
        this.email = email;
        this.address = address;
        this.postcode = postcode;
    }

    @OneToMany(mappedBy = "customer")
    private List<Order> orders = new ArrayList<>();
}
