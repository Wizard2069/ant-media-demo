package com.company.orderservice.domain.service;

import com.company.orderservice.domain.entities.Order;
import com.company.orderservice.domain.repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    
    public List<Order> getOrders() {
        return orderRepository.findAll();
    }
}
