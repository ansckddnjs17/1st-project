package org.back.back;

import org.back.back.domain.admin.dto.CustomerOrderDto;
import org.back.back.domain.admin.service.AdminService;
import org.back.back.domain.customer.entity.Customer;
import org.back.back.domain.customer.repository.CustomerRepository;
import org.back.back.domain.order.dto.OrderDto;
import org.back.back.domain.order.entity.Order;
import org.back.back.domain.order.repository.OrderRepository;
import org.back.back.domain.order.service.OrderService;
import org.back.back.domain.product.entity.Product;
import org.back.back.domain.product.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
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

    @Autowired
    private AdminService adminService;


}
