package com.company.demo.domain.utils.ws;

import com.company.demo.domain.utils.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.buffer.NettyDataBufferFactory;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.http.server.reactive.ServerHttpResponseDecorator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.HandshakeInfo;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.adapter.ReactorNettyWebSocketSession;
import org.springframework.web.reactive.socket.server.RequestUpgradeStrategy;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.netty.http.server.HttpServerResponse;
import reactor.netty.http.server.WebsocketServerSpec;

import java.util.function.Supplier;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomRequestUpgradeStrategy implements RequestUpgradeStrategy {
    
    private final JwtUtils jwtUtils;
    
    @Override
    public Mono<Void> upgrade(
        ServerWebExchange exchange,
        WebSocketHandler handler,
        String subProtocol,
        Supplier<HandshakeInfo> handshakeInfoFactory
    ) {
        ServerHttpResponse response = exchange.getResponse();
        HttpServerResponse reactorResponse = ServerHttpResponseDecorator.getNativeResponse(response);
        HandshakeInfo handshakeInfo = handshakeInfoFactory.get();
        NettyDataBufferFactory bufferFactory = (NettyDataBufferFactory) response.bufferFactory();
        
        String token = handshakeInfo.getHeaders()
            .getFirst("Sec-WebSocket-Protocol")
            .split(",")[1];
        
        return response.setComplete()
            .then(Mono.defer(() -> {
                WebsocketServerSpec spec = WebsocketServerSpec.builder()
                    .protocols("access_token")
                    .build();
                
                return reactorResponse.sendWebsocket((in, out) -> {
                    ReactorNettyWebSocketSession session = new ReactorNettyWebSocketSession(
                        in, out, handshakeInfo, bufferFactory, spec.maxFramePayloadLength()
                    );
    
                    if (token.isEmpty()) {
                        return out.sendClose(1002, "Unauthorized");
                    }
                    
                    try {
                        Jwt jwt = jwtUtils.getJwtDecoder().decode(token);
                    } catch (Exception e) {
                        log.info("Error: {}", e.getMessage());
                        
                        return out.sendClose(1002, "Forbidden");
                    }
                    
                    return handler.handle(session);
                }, spec);
            }));
    }
}
