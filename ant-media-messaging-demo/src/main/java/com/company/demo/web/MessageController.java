package com.company.demo.web;

import com.company.demo.domain.assembler.MessageRepresentationModelAssembler;
import com.company.demo.domain.entities.Message;
import com.company.demo.domain.service.MessageService;
import com.company.demo.domain.utils.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.MediaTypes;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping(
    path = "/api/v1/streams",
    produces = MediaTypes.HAL_JSON_VALUE
)
@RequiredArgsConstructor
public class MessageController {
    
    private final MessageRepresentationModelAssembler assembler;
    
    private final MessageService messageService;
    
    private final JwtUtils jwtUtils;
    
    @PreAuthorize("isAuthenticated()")
    @GetMapping(path = "/{streamId}/message-history")
    @ResponseStatus(code = HttpStatus.OK)
    public Mono<CollectionModel<EntityModel<Message>>> getAll(
        @PathVariable("streamId") String streamId,
        ServerWebExchange exchange
    ) {
        String token = exchange.getRequest().getHeaders().getFirst("Authorization")
            .replace("Bearer", "").trim();
        String userId = jwtUtils.getUserId(token);
        
        Flux<Message> messageHistory = messageService.getMessageHistory(userId, streamId);
        
        return assembler.toCollectionModel(messageHistory, exchange);
    }
}
