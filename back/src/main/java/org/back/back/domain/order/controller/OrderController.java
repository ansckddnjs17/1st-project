package org.back.back.domain.order.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.back.back.domain.order.dto.OrderDto;
import org.back.back.domain.order.entity.Order;
import org.back.back.domain.order.service.OrderService;
import org.back.back.global.dto.RsData;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/orders")
    public List<OrderDto> getOrders(){
        List<Order> orderList = orderService.findAll();

        List<OrderDto> orderDtoList=orderList.stream()
                .map(OrderDto::new)
                .toList();

        return orderDtoList;
    }

    @PutMapping("/orders/{id}")
    @Transactional
    public RsData<Void> modify(
            @PathVariable int id,
            @Valid @RequestBody OrderModifyReqBody reqBody
    ){
        Order order = orderService.findById(id);
    }

    @DeleteMapping("/orders/{id}")
    @Transactional
    public RsData<Void> delete(){}

    record OrderModifyReqBody(
        @NotBlank(message = "수량을 입력해주세요.")
        int quantity
    ){}
}
