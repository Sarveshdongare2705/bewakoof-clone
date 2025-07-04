package com.bewakoof.bewakoof.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartId;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("cart")
    private List<CartItem> cartItems;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    private AppUser appUser;

    // Base calculations
    private Integer totalQuantity = 0;
    private Double subtotal = 0.0;           // Sum of all item prices (with combo offers)
    private Double totalDeliveryCharge = 0.0; // Sum of all delivery charges
    private Double merchandiseTotal = 0.0;    // subtotal + totalDeliveryCharge

    // Discounts
    private Double couponDiscount = 0.0;      // Discount from applied coupon
    private Double shippingDiscount = 0.0;    // Free shipping discount (delivery charge waived)
    
    // Final amount
    private Double finalAmount = 0.0;         // merchandiseTotal - couponDiscount - shippingDiscount

    @ManyToOne
    @JoinColumn(name = "selected_address_id")
    private Address selectedAddress;

    @ManyToOne
    private Coupon appliedCoupon;

    private static final Double FREE_SHIPPING_THRESHOLD = 1499.0;

    public boolean isEligibleForFreeShipping() {
        return subtotal >= FREE_SHIPPING_THRESHOLD;
    }
}