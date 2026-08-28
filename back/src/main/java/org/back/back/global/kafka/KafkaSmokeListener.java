package org.back.back.global.kafka;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Slf4j
@Component
public class KafkaSmokeListener {
    @Value("${spring.discord.webhook-url}")
    private String webhookUrl;
    @KafkaListener(topics = "order-created")
    public void listen(String message) {
        log.info("kafka 수신: {}", message);
        RestClient.create()
                .post()
                .uri(webhookUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("content", message))
                .retrieve()
                .toBodilessEntity();
    }
}