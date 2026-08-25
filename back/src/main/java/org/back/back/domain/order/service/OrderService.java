package org.back.back.domain.order.service;

import lombok.RequiredArgsConstructor;
import org.back.back.domain.customer.repository.CustomerRepository;
import org.back.back.domain.order.dto.OrderDto;
import org.back.back.domain.order.entity.Order;
import org.back.back.domain.order.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;

    public List<OrderDto> findOrders(String email,LocalDate date) {

        if (!customerRepository.existsByEmail(email)) {
            throw new NoSuchElementException(
                    "존재하지 않는 고객입니다."
            );
        }

        List<Order> orders;

        if (date == null) {
            orders = orderRepository
                    .findAllByCustomerEmailOrderByCreatedDateAsc(email);
        } else {
            orders = orderRepository
                    .findAllByCustomerEmailAndDeliveryDateOrderByCreatedDateAsc(
                            email,
                            date
                    );
        }

        return orders.stream()
                .map(OrderDto::new)
                .toList();
    }

    public Order modify(int id, int quantity){
        Order order = orderRepository.findById(id).orElseThrow();
        if(isShipping(order)){
            throw new RuntimeException("배송중인 주문은 수정할 수 없습니다");
        }
        order.modify(quantity);
        return order;
    }

    public void delete(int id){
        Order order = orderRepository.findById(id).orElseThrow();
        if(isShipping(order)){
            throw new RuntimeException("배송중인 주문은 삭제할 수 없습니다");
        }
        orderRepository.delete(order);
    }

    // 배송중을 확인하는 함수
    // 예) 8/24 14:00 ~ 8/25 13:59:59 주문 -> deliveryDate = 8/25 -> 8/25 14:00부터 배송중
    // 배송중 -> 수정,삭제 불가
    private boolean isShipping(Order order){
        LocalDateTime now = LocalDateTime.now();
        LocalDate deliveryDate = order.getDeliveryDate();
        return !now.isBefore(deliveryDate.atTime(14,0));
    }
}
