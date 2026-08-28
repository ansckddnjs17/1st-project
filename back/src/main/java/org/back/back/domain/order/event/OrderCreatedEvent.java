package org.back.back.domain.order.event;

import java.time.LocalDate;

public record OrderCreatedEvent(
        String message,
        int orderId,
        String customerEmail,
        String productName,
        int quantity,
        LocalDate deliveryDate
) {
    public String toAlertMessage(){
        return """
                %s
                주문번호: %d
                고객 이메일: %s
                상품: %s
                총 수량: %d
                배송일: %s
                """.formatted(message,orderId,customerEmail,productName,quantity,deliveryDate);
    }
}
