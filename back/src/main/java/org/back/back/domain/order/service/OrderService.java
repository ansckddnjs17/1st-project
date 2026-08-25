package org.back.back.domain.order.service;

import lombok.RequiredArgsConstructor;
import org.back.back.domain.order.entity.Order;
import org.back.back.domain.order.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    public List<Order> findAll(){
        return orderRepository.findAll();
    }

    public Order modify(int id, int quantity){
        Order order = orderRepository.findById(id).orElseThrow();
        order.modify(quantity);
        return order;
    }

    public void delete(int id){
        Order order = orderRepository.findById(id).orElseThrow();
        orderRepository.delete(order);
    }
}
