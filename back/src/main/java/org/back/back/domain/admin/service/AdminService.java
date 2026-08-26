package org.back.back.domain.admin.service;

import lombok.RequiredArgsConstructor;
import org.back.back.domain.admin.dto.CustomerOrderDto;
import org.back.back.domain.customer.repository.CustomerRepository;
import org.back.back.domain.order.dto.OrderDto;
import org.back.back.domain.order.entity.Order;
import org.back.back.domain.order.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;

    public List<CustomerOrderDto> findAllOrders(){
        return orderRepository.findAll().stream()
                .map(order -> new CustomerOrderDto(order)).toList();
    }

    public List<CustomerOrderDto> findOrdersByDeliveryDate(LocalDate date){
        return orderRepository.findAllByDeliveryDateOrderByCreatedDateAsc(date).stream()
                .map(order -> new CustomerOrderDto(order)).toList();
    }

    public OrderDto findOrder(int id){
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 주문이 존재하지 않습니다. ID: " + id));
        return new OrderDto(order);
    }
    public List<CustomerOrderDto> findOrdersByCustomerId(Integer customerId) {
        return orderRepository.findAllByCustomerIdOrderByCreatedDateAsc(customerId)
                .stream()
                .map(CustomerOrderDto::new)
                .toList();
    }

    public List<CustomerOrderDto> findOrdersByCustomerIdAndDate(Integer customerId, LocalDate date) {
        return orderRepository.findAllByCustomerIdAndDeliveryDateOrderByCreatedDateAsc(customerId, date)
                .stream()
                .map(CustomerOrderDto::new)
                .toList();
    }
}
