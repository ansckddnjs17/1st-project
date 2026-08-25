package org.back.back;

import org.back.back.domain.customer.entity.Customer;
import org.back.back.domain.customer.repository.CustomerRepository;
import org.back.back.domain.order.dto.OrderDto;
import org.back.back.domain.order.entity.Order;
import org.back.back.domain.order.repository.OrderRepository;
import org.back.back.domain.order.service.OrderService;
import org.back.back.domain.product.entity.Product;
import org.back.back.domain.product.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class BackApplicationTests {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    @Test
    void test1() {
        // given: 고객 저장
        Customer customer = new Customer();
        customerRepository.save(customer);

        // 상품 저장
        Product product = new Product();
        productRepository.save(product);

        // 주문 저장
        Order order = new Order(
                customer,
                product,
                2,
                LocalDate.now().plusDays(1)
        );

        orderRepository.saveAndFlush(order);

        // when: 전체 주문 조회
        List<OrderDto> result = orderService.findOrders(customer.getId(), null);

        // then
        assertThat(result).hasSize(1);

        OrderDto orderDto = result.getFirst();

        assertThat(orderDto.id()).isEqualTo(order.getId());
        assertThat(orderDto.customerId()).isEqualTo(customer.getId());
        assertThat(orderDto.productId()).isEqualTo(product.getId());
        assertThat(orderDto.quantity()).isEqualTo(2);
        assertThat(orderDto.deliveryDate())
                .isEqualTo(LocalDate.now().plusDays(1));
    }
}
