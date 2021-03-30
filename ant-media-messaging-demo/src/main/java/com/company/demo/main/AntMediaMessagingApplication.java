package com.company.demo.main;

import com.company.demo.main.config.AntMediaMessagingConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import({AntMediaMessagingConfiguration.class})
public class AntMediaMessagingApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(AntMediaMessagingApplication.class, args);
    }
    
}
