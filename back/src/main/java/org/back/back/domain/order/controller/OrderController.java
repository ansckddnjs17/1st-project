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
        Order order = orderService.modify(id, reqBody.quantity);
        return new RsData<>("200-1", "주문이 수정되었습니다.");
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
        @NotBlank(message = "수량을 입력해주세요.")
        int quantity
    ){}
}
