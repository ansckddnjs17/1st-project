package org.back.back.domain.order.controller;

import lombok.RequiredArgsConstructor;
import org.back.back.domain.order.service.OrderService;
import org.back.back.global.dto.RsData;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/orders")
public class OrderController {
    final OrderService orderService;

    @PutMapping("/{id}")
    @Transactional
    public RsData<Void>
}
