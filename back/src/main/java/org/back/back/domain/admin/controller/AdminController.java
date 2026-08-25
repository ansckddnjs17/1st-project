package org.back.back.domain.admin.controller;

import lombok.RequiredArgsConstructor;
import org.back.back.domain.admin.dto.OrderDto;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminController {

    @GetMapping(value = "/oders")
    public List<OrderDto> getAllOlder(
            @RequestParam(name = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ){
        if(date == null){

        }else{

        }
        List<OrderDto> l = new ArrayList<>();
        l.add(new OrderDto("1","","",0,0, LocalDate.now()));
        l.add(new OrderDto("2","","",0,0, LocalDate.now()));
        return l;
    }

    @GetMapping(value = "/oders/{id}")
    public OrderDto getOlder(
            @PathVariable Integer id
    ){
        return new OrderDto("2","","",0,0, LocalDate.now());
    }

}
