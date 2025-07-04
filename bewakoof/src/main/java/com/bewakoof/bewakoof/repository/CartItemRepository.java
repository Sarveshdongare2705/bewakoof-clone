package com.bewakoof.bewakoof.repository;

import com.bewakoof.bewakoof.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findAllByCart_CartId(Long cartId);
}
