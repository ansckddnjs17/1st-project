package org.back.back.domain.admin.controller;

import lombok.RequiredArgsConstructor;
import org.back.back.domain.admin.dto.CustomerOrderDto;
import org.back.back.domain.admin.service.AdminService;
import org.back.back.domain.order.dto.OrderDto;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminService adminService;

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
}
