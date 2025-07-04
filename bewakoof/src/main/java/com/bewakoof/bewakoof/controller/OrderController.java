package com.bewakoof.bewakoof.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bewakoof.bewakoof.model.Order;
import com.bewakoof.bewakoof.service.OrderService;

@RestController
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/orders")
    public List<Order> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        return orderService.getUserOrders(userDetails);
    }

    @PostMapping("/order")
    public boolean placeOrder(@AuthenticationPrincipal UserDetails userDetails , @RequestParam String paymentMethod) {
        return orderService.placeOrder(userDetails , paymentMethod);
    }

    @PatchMapping("/orders/cancel/{orderId}")
    public ResponseEntity<String> cancelOrder(@PathVariable Long orderId,
            @AuthenticationPrincipal UserDetails userDetails) {
        orderService.cancelOrder(userDetails, orderId);
        return ResponseEntity.ok("Order cancelled successfully.Refund is initiated");
    }

}
