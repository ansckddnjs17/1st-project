package org.back.back.domain.order.service;

import lombok.RequiredArgsConstructor;
import org.back.back.domain.order.dto.OrderDto;
import org.back.back.domain.order.entity.Order;
import org.back.back.domain.order.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    public List<OrderDto> findOrders(LocalDate date) {
        List<Order> orders;

        if (date == null) {
            orders = orderRepository.findAllByOrderByCreatedDateAsc();
        } else {
            orders = orderRepository
                    .findAllByDeliveryDateOrderByCreatedDateAsc(date);
        }

        return orders.stream()
                .map(OrderDto::new)
                .toList();
    }
}
