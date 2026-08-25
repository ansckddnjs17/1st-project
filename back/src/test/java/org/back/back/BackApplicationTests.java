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
        // given: 공통 상품 1개 저장
        Product product = new Product();
        productRepository.save(product);

        LocalDate deliveryDate =
                LocalDate.of(2026, 8, 26);

        String[] emails = {
                "customer1@test.com",
                "customer2@test.com",
                "customer3@test.com",
                "customer4@test.com",
                "customer5@test.com"
        };

        for (int i = 0; i < emails.length; i++) {
            // 고객 저장
            Customer customer = new Customer(emails[i]);
            customerRepository.save(customer);

            // 고객별 주문 저장
            Order order = new Order(
                    customer,
                    product,
                    i + 1,
                    deliveryDate
            );

            orderRepository.save(order);

            System.out.println(
                    "email=" + customer.getEmail()
                            + ", customerId=" + customer.getId()
                            + ", quantity=" + order.getQuantity()
            );
        }

        orderRepository.flush();

        // then
        assertThat(orderRepository.count())
                .isGreaterThanOrEqualTo(5);
    }
}
