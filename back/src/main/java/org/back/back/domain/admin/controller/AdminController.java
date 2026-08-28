package org.back.back.domain.admin.controller;

import lombok.RequiredArgsConstructor;
import org.back.back.domain.admin.dto.CustomerOrderDto;
import org.back.back.domain.admin.dto.GroupOrderDto;
import org.back.back.domain.admin.service.AdminService;
import org.back.back.domain.order.dto.OrderDto;
import org.back.back.global.sse.AdminSseEmitters;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminService adminService;
    private final AdminSseEmitters adminSseEmitters;

    @GetMapping(value = "/groupOrders")
    public List<GroupOrderDto> getGroupOrders(){
        return adminService.findAllGroupeOrder();
    }

    @GetMapping(value = "/orders")
    public List<CustomerOrderDto> getOrders(
            @RequestParam(name = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ){
        if(date == null){
            return adminService.findAllOrders();
        }else{
            return adminService.findOrdersByDeliveryDate(date);
        }
    }

    @GetMapping(value = "/orders/{id}")
    public OrderDto getOrder(
            @PathVariable Integer id
    ){
        return adminService.findOrder(id);
    }
    @GetMapping(value = "/orders", params = "customerId")
    public List<CustomerOrderDto> getOrdersByCustomer(
            @RequestParam(name = "customerId") Integer customerId
    ) {
        return adminService.findOrdersByCustomerId(customerId);
    }

    @GetMapping(value = "/orders", params = {"date", "customerId"})
    public List<CustomerOrderDto> getOrdersByCustomerAndDate(
            @RequestParam(name = "date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(name = "customerId") Integer customerId
    ) {
        return adminService.findOrdersByCustomerIdAndDate(customerId, date);
    }

    @GetMapping(value = "/order-stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(){
        SseEmitter emitter = new SseEmitter(0L);
        adminSseEmitters.add(emitter);
        return emitter;
    }
}
