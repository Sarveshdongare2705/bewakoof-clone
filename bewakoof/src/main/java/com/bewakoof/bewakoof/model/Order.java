package com.bewakoof.bewakoof.model;

import java.time.LocalDateTime;
import java.util.List;

import com.bewakoof.bewakoof.enums.OrderStatus;
import com.bewakoof.bewakoof.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @Column(unique = true)
    private String orderCode;

    // Who placed the order
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    // Order summary
    private int totalQuantity;
    private double subtotal; // total of item prices
    private double totalDeliveryCharge;
    private double couponDiscount;
    private double shippingDiscount;
    private double finalAmount;

    // Payment info
    private String paymentMethod; // COD, UPI, Card, Wallet etc.
    private boolean paymentSuccess;
    private String paymentId; // UPI txn ID, Razorpay ID, etc.

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    // Timestamps
    private LocalDateTime orderDate;
    private LocalDateTime expectedDeliveryDate;

    // Shipping address snapshot
    private String addressType;
    private String phone;
    private String street;
    private String landmark;
    private String city;
    private String state;
    private String country;
    private String pincode;

    // One-to-many mapping to order items
    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;
}
