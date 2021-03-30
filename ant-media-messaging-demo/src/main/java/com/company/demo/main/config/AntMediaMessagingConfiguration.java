package com.company.demo.main.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.*;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;
import org.springframework.hateoas.config.EnableHypermediaSupport;
import org.springframework.hateoas.support.WebStack;

@Configuration
@EnableAutoConfiguration
@EnableHypermediaSupport(
    type = EnableHypermediaSupport.HypermediaType.HAL,
    stacks = {WebStack.WEBFLUX}
)
@EnableReactiveMongoRepositories(basePackages = {"com.company.demo"})
@ComponentScan(basePackages = {"com.company.demo"})
@Import({
    WebSocketConfiguration.class,
    SecurityConfig.class
})
public class AntMediaMessagingConfiguration {
    
    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule())
            .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        
        return mapper;
    }
}
