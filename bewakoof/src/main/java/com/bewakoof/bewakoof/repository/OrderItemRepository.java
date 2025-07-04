package com.bewakoof.bewakoof.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bewakoof.bewakoof.model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem , Long> {
    
}
