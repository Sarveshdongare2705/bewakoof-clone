package com.bewakoof.bewakoof.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemId;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private Order order;

    // Snapshot of product
    private Long productId;
    private String productName;
    private String productImageUrl;

    // Variant info (snapshot)
    private String colorName;
    private String sizeLabel;

    private int quantity;

    // Price info
    private double pricePerUnit;          // Final price per unit paid (after discount or offer)
    private double totalPrice;            // pricePerUnit * quantity
    private double deliveryCharge;

    private int estimatedDeliveryDays;
    private int returnDays;
}

