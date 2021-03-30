package com.company.demo.domain.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> accessDenied() {
        Map<String, String> body = new HashMap<>();
        body.put("code", "403");
        body.put("message", "Forbidden");
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }
}
