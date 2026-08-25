package org.back.back.domain.admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminController {

    public void getAllOlder(){
        // TODO: 모든 주문목록 조회
    }

    public void getOlder(){
        // TODO: id로 주문 조회
    }

    public void getOlderByDeliveryDate(){
        // TODO: 배송 날짜로 주문 조회
    }

}
