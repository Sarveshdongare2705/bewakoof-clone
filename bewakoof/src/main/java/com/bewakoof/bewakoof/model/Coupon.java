package com.bewakoof.bewakoof.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long couponId;

    private String code;
    private String description;

    @Enumerated(EnumType.STRING)
    private CouponType type;              // FLAT or PERCENTAGE

    private Double discountValue;         // Amount for FLAT, percentage for PERCENTAGE
    private Double maxDiscountAmount;     // Cap for percentage discounts
    private Double minCartAmount;

    private boolean oneTimePerUser;
    private boolean active;
    private LocalDateTime expiryDate;

    public enum CouponType {
        FLAT, PERCENTAGE
    }

    // Calculate discount amount based on cart subtotal
    public double calculateDiscount(double cartSubtotal) {
        if (type == CouponType.FLAT) {
            return Math.min(discountValue, cartSubtotal);
        } else if (type == CouponType.PERCENTAGE) {
            double percentageDiscount = (cartSubtotal * discountValue) / 100.0;
            return maxDiscountAmount != null ? 
                Math.min(percentageDiscount, maxDiscountAmount) : percentageDiscount;
        }
        return 0.0;
    }
}