package com.company.demo.domain.assembler;

import com.company.demo.domain.entities.Message;
import com.company.demo.web.MessageController;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.server.ServerWebExchange;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Comparator;
import java.util.Map;

import static org.springframework.hateoas.server.reactive.WebFluxLinkBuilder.*;

@Component
public class MessageRepresentationModelAssembler
    extends SimpleIdentifiableReactiveRepresentationModelAssembler<Message> {
    
    private static DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    
    public MessageRepresentationModelAssembler() {
        super(MessageController.class);
    }
    
    @Override
    protected String getCollectionName() {
        return "messages";
    }
    
    @Override
    protected Comparator<Message> totalSortFunction() {
        return (x ,y) -> {
            try {
                return df.parse(y.getTime()).compareTo(df.parse(x.getTime()));
            } catch (ParseException e) {
                e.printStackTrace();
            }
            
            return 0;
        };
    }
    
    @Override
    protected Comparator<Message> chunkSortFunction() {
        return (x ,y) -> {
            try {
                return df.parse(x.getTime()).compareTo(df.parse(y.getTime()));
            } catch (ParseException e) {
                e.printStackTrace();
            }
        
            return 0;
        };
    }
    
    @Override
    protected WebFluxBuilder initLinkBuilder(ServerWebExchange exchange) {
        Map<String, String> attributes = exchange.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
        assert attributes != null;
        
        return linkTo(methodOn(MessageController.class).getAll(
            attributes.get("id"), exchange
        ), exchange);
    }
}
