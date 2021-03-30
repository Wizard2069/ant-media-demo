package com.company.orderservice.domain.repositories;

import com.company.orderservice.domain.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Integer> {
}
