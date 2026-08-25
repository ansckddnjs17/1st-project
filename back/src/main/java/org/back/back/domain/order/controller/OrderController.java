package org.back.back.domain.order.controller;

import lombok.RequiredArgsConstructor;
import org.back.back.domain.order.dto.OrderDto;
import org.back.back.domain.order.entity.Order;
import org.back.back.domain.order.service.OrderService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/orders")
    public List<OrderDto> findOrders(
            @RequestParam(required = false) // 날짜 생략(null일 경우)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) //ISO 날짜 형식 => yyyy-mm-dd
            LocalDate date
    ) {
        return orderService.findOrders(date);
    }

}
