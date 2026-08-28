package org.back.back.global.kafka;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.back.back.global.sse.AdminSseEmitters;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaSmokeListener {
    private final AdminSseEmitters adminSseEmitters;
    @Value("${spring.discord.webhook-url}")
    private String webhookUrl;
    @KafkaListener(topics = "order-created")
    public void listen(String message) {
        log.info("kafka 수신: {}", message);
        adminSseEmitters.send(message);
        // 디코에 메시지 전달
        RestClient.create()
                .post()
                .uri(webhookUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("content", message))
                .retrieve()
                .toBodilessEntity();
    }
}