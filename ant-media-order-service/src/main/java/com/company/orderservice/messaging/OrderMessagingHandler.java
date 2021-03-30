package com.company.orderservice.messaging;

import com.company.demo.messaging.Payload;
import com.company.orderservice.domain.entities.Order;
import com.company.orderservice.domain.repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderMessagingHandler {

    private final OrderRepository orderRepository;
    
    private final JavaMailSender mailSender;
    
    @KafkaListener(topics = {"com.company.orderservice"})
    public void receivePayload(Payload payload) {
        Order order = Order.builder()
            .userEmail(payload.getEmail())
            .dataPack(payload.getPack())
            .build();
        orderRepository.save(order);
    
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(payload.getEmail());
        message.setSubject("Data pack order");
        message.setText("Your order: " + payload.getPack());
        mailSender.send(message);
    }
}
