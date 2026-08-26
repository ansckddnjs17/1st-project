package org.back.back.domain.order.repository;

import org.back.back.domain.customer.entity.Customer;
import org.back.back.domain.order.entity.Order;
import org.back.back.domain.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    Optional<Order> findByCustomerAndProductAndDeliveryDate(
            Customer customer,
            Product product,
            LocalDate deliveryDate
    );
    List<Order> findAllByCustomerIdOrderByCreatedDateAsc(Integer customerId);
    List<Order> findAllByCustomerIdAndDeliveryDateOrderByCreatedDateAsc(
            Integer customerId,
            LocalDate deliveryDate
    );
}
