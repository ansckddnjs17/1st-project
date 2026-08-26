package org.back.back.domain.order.repository;

import org.back.back.domain.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Integer> {
    List<Order> findAllByOrderByCreatedDateAsc(); // 먼저 등록된 주문부터 반환.

    List<Order> findAllByDeliveryDateOrderByCreatedDateAsc(LocalDate deliveryDate); // 배송일 반환

    // 특정 고객의 전체 주문
    List<Order> findAllByCustomerEmailOrderByCreatedDateAsc(
            String email
    );

    List<Order>
    findAllByCustomerEmailAndDeliveryDateOrderByCreatedDateAsc(
            String email,
            LocalDate deliveryDate
    );
}
