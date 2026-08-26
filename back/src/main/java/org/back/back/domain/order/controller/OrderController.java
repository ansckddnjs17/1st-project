package org.back.back.domain.order.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.back.back.domain.order.dto.OrderCreateRequestDto;
import org.back.back.domain.order.dto.OrderCreateResponseDto;
import org.back.back.domain.order.dto.OrderDto;
import org.back.back.domain.order.entity.Order;
import org.back.back.domain.order.service.OrderService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.back.back.global.dto.RsData;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/orders")
    public RsData<List<OrderDto>> findOrders(
            @RequestParam
            String email,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        List<OrderDto> orders=orderService.findOrders(email,date);

        return new RsData<>(
                "200-1",
                "주문 목록을 조회했습니다.",
                orders
        );
    }


    @PutMapping("/orders/{id}")
    @Transactional
    public RsData<OrderDto> modify(
            @PathVariable int id,
            @Valid @RequestBody OrderModifyReqBody reqBody
    ){
        Order order = orderService.modify(id, reqBody.quantity);
        return new RsData<OrderDto>("200-1", "주문이 수정되었습니다.",new OrderDto(order));
    }

    @DeleteMapping("/orders/{id}")
    @Transactional
    public RsData<Void> delete(
            @PathVariable int id
    ){
        orderService.delete(id);
        return new RsData<>("200-1", "주문이 삭제되었습니다.");
    }

    record OrderModifyReqBody(
            @Min(1)
        int quantity
    ){}

    @PostMapping("/orders")
    public RsData<OrderCreateResponseDto> createOrder(
            @Valid @RequestBody OrderCreateRequestDto request
    ){
        OrderCreateResponseDto createdOrder = orderService.createOrders(request);
        return new RsData<>("201", "주문이 생성되었습니다.", createdOrder);
    }
}
