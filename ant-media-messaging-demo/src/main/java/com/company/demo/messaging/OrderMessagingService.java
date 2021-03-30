package com.company.demo.messaging;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderMessagingService {
    
    private final KafkaTemplate<String, Payload> kafkaTemplate;
    
    public void sendPayload(Payload payload) {
        kafkaTemplate.sendDefault(payload);
    }
}
