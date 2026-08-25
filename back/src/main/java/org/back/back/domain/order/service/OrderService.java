package org.back.back.domain.order.service;

import lombok.RequiredArgsConstructor;
import org.back.back.domain.order.entity.Order;
import org.back.back.domain.order.repository.OrderRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    public Order findById(int id){
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));
    }

    public Order Modify(int id, int quantity){
        return orderRepository.
    }
}
