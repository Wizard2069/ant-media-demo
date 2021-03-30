package com.company.demo.main.config;

import com.company.demo.domain.service.CustomWebSocketHandler;
import com.company.demo.domain.utils.ws.CustomRequestUpgradeStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.server.WebSocketService;
import org.springframework.web.reactive.socket.server.support.HandshakeWebSocketService;
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter;

import java.util.HashMap;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class WebSocketConfiguration {
    
    private final CustomRequestUpgradeStrategy requestUpgradeStrategy;
    
    @Bean
    public HandlerMapping webSocketHandlerMapping(CustomWebSocketHandler webSocketHandler) {
        Map<String, WebSocketHandler> map = new HashMap<>();
        map.put("/messages", webSocketHandler);
        
        SimpleUrlHandlerMapping handlerMapping = new SimpleUrlHandlerMapping();
        handlerMapping.setOrder(1);
        handlerMapping.setUrlMap(map);
        
        return handlerMapping;
    }
    
    @Bean
    public WebSocketHandlerAdapter handlerAdapter() {
        return new WebSocketHandlerAdapter(webSocketService());
    }
    
    @Bean
    public WebSocketService webSocketService() {
        return new HandshakeWebSocketService(requestUpgradeStrategy);
    }
}
