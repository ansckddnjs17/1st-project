package org.back.back.domain.order.repository;

import org.back.back.domain.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Integer> {
    List<Order> findAllByOrderByCreatedDateAsc();

    List<Order> findAllByDeliveryDateOrderByCreatedDateAsc(LocalDate deliveryDate);
}
