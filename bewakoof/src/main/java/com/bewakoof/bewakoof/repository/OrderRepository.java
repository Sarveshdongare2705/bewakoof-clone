package com.bewakoof.bewakoof.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bewakoof.bewakoof.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_UserId(Long userId);

}
