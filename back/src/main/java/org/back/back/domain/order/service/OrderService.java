package org.back.back.domain.order.service;

import lombok.RequiredArgsConstructor;
import org.back.back.domain.customer.entity.Customer;
import org.back.back.domain.customer.repository.CustomerRepository;
import org.back.back.domain.customer.service.CustomerService;
import org.back.back.domain.order.dto.OrderCreateRequestDto;
import org.back.back.domain.order.dto.OrderDto;
import org.back.back.domain.order.entity.Order;
import org.back.back.domain.order.event.OrderCreatedEvent;
import org.back.back.domain.order.repository.OrderRepository;
import org.back.back.domain.product.entity.Product;
import org.back.back.domain.product.repository.ProductRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final CustomerService customerService;
    //카프카 이벤트 발행용
    private final ApplicationEventPublisher eventPublisher;
    private static final LocalTime CUTOFF_TIME = LocalTime.of(14, 0);

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

    @Transactional
    public Order modify(int id, int quantity){
        Order order = orderRepository.findById(id).orElseThrow();
        if(isShipping(order)){
            throw new RuntimeException("배송중인 주문은 수정할 수 없습니다");
        }
        order.modify(quantity);
        return order;
    }

    @Transactional
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

    @Transactional
    public List<OrderDto> createOrders(OrderCreateRequestDto request) {
        Customer customer = customerService.findOrCreate(
                request.email(), request.address(), request.postcode()
        );

        LocalDateTime now = LocalDateTime.now();
        LocalDate deliveryDate = calculateDeliveryDate(now);

        return request
                .items()
                .stream()
                .map(line ->
                        createOrder(line, customer, deliveryDate)
                )
                .toList();
    }

    private OrderDto createOrder(
            OrderCreateRequestDto.OrderLineRequestDto line,
            Customer customer,
            LocalDate deliveryDate
    ) {
        Product product = productRepository
                .findById(line.productId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다. " + line.productId()));

        Optional<Order> existingOrder = orderRepository
                .findByCustomerAndProductAndDeliveryDate(customer, product, deliveryDate);

//주문 Dto를 주기전 OrderCreatedEvent 발행
        if(existingOrder.isPresent()) {
            Order order = existingOrder.get();
            order.modify(order.getQuantity() + line.quantity());
            eventPublisher.publishEvent(new OrderCreatedEvent(
                    order.getId(),
                    order.getCustomer().getEmail(),
                    order.getProduct().getName(),
                    order.getQuantity(),
                    order.getDeliveryDate()
            ));
            return new OrderDto(order);
        }

        Order order = new Order(customer, product, line.quantity(), deliveryDate);
        Order savedOrder = orderRepository.save(order);

        eventPublisher.publishEvent(new OrderCreatedEvent(
                order.getId(),
                order.getCustomer().getEmail(),
                order.getProduct().getName(),
                order.getQuantity(),
                order.getDeliveryDate()
        ));
        return new OrderDto(savedOrder);
    }

    private LocalDate calculateDeliveryDate(LocalDateTime now){
        LocalDate today = now.toLocalDate();
        LocalTime currentTime = now.toLocalTime();
        if(currentTime.isBefore(CUTOFF_TIME)){
            return today;
        }
        return today.plusDays(1);
    }
}
