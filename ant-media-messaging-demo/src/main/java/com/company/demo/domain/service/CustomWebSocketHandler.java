package com.company.demo.domain.service;

import com.company.demo.domain.entities.Message;
import com.company.demo.domain.repositories.MessageRepository;
import com.company.demo.domain.utils.filter.MessageUtils;
import com.company.demo.domain.utils.ws.CommandMsg;
import com.company.demo.messaging.OrderMessagingService;
import com.company.demo.messaging.Payload;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomWebSocketHandler implements WebSocketHandler {
    
    private final ObjectMapper mapper;
    
    private final MessageRepository messageRepository;
    
    private final OrderMessagingService messagingService;
    
    @Override
    public Mono<Void> handle(WebSocketSession session) {
        Flux<WebSocketMessage> output = session.receive()
            .map(webSocketMessage -> {
                String msg = webSocketMessage.getPayloadAsText();
                
                if (checkJsonCompatibility(msg, CommandMsg.class)) {
                    try {
                        CommandMsg command = mapper.readValue(msg, CommandMsg.class);
                        
                        if (command.getCommand().equals("ping")) {
                            return new CommandMsg("pong").toString();
                        }
                    } catch (JsonProcessingException e) {
                        e.printStackTrace();
                    }
                }
                
                if (checkJsonCompatibility(msg, Message.class)) {
                    try {
                        Message received = mapper.readValue(msg, Message.class);
                        log.info("Parsed message: {}", received);
    
                        if (MessageUtils.match(received)) {
                            Payload payload = new Payload(
                                received.getSender().getEmail(),
                                received.getMsg()
                            );
                            messagingService.sendPayload(payload);
                        }
    
                        messageRepository.save(received).subscribe();
                    } catch (JsonProcessingException e) {
                        e.printStackTrace();
                    }
                }
    
                return new CommandMsg("success").toString();
            })
            .map(session::textMessage);
        
        return session.send(output);
    }
    
   private boolean checkJsonCompatibility(String jsonStr, Class<?> valueType) {
        try {
            mapper.readValue(jsonStr, valueType);
            return true;
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return false;
        }
   }
}
