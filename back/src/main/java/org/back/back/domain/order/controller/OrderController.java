package org.back.back.domain.order.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
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
    public List<OrderDto> findOrders(
            @RequestParam(required = false) // 날짜 생략(null일 경우)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) //ISO 날짜 형식 => yyyy-mm-dd
            LocalDate date
    ) {
        return orderService.findOrders(date);
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
}
