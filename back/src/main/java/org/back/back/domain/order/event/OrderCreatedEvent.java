package org.back.back.domain.order.event;

import java.time.LocalDate;

public record OrderCreatedEvent(
        int orderId,
        String customerEmail,
        String productName,
        int quantity,
        LocalDate deliveryDate
) {
    public String toAlertMessage(){
        return """
                새 주문이 들어왔습니다.
                주문번호: %d
                고객 이메일: %s
                상품: %s
                수량: %d
                배송일: %s
                """.formatted(orderId,customerEmail,productName,quantity,deliveryDate);
    }
}
