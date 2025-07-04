package com.bewakoof.bewakoof.dto;

import com.bewakoof.bewakoof.model.Address;
import com.bewakoof.bewakoof.model.Coupon;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartResponseDTO {
    private Long cartId;
    
    // Pricing breakdown
    private Double subtotal;              // Sum of all item prices (with combo offers)
    private Double totalDeliveryCharge;   // Sum of all delivery charges
    private Double couponDiscount;        // Discount from applied coupon
    private Double shippingDiscount;      // Free shipping discount
    private Double merchandiseTotal;      // subtotal + totalDeliveryCharge
    private Double finalAmount;           // Final payable amount
    
    // Cart details
    private Integer totalQuantity;
    private Address selectedAddress;
    private List<CartItemResponseDTO> cartItems;
    private Coupon appliedCoupon;
    
    // Additional info
    private boolean eligibleForFreeShipping;
    private Double freeShippingThreshold;
    private Double amountToFreeShipping;  // How much more to spend for free shipping
    
    // Constructor with calculated fields
    public CartResponseDTO(Long cartId, Double subtotal, Double totalDeliveryCharge, 
                          Double couponDiscount, Double shippingDiscount, Double merchandiseTotal,
                          Double finalAmount, Integer totalQuantity, Address selectedAddress,
                          List<CartItemResponseDTO> cartItems, Coupon appliedCoupon, 
                          boolean eligibleForFreeShipping) {
        this.cartId = cartId;
        this.subtotal = subtotal;
        this.totalDeliveryCharge = totalDeliveryCharge;
        this.couponDiscount = couponDiscount;
        this.shippingDiscount = shippingDiscount;
        this.merchandiseTotal = merchandiseTotal;
        this.finalAmount = finalAmount;
        this.totalQuantity = totalQuantity;
        this.selectedAddress = selectedAddress;
        this.cartItems = cartItems;
        this.appliedCoupon = appliedCoupon;
        this.eligibleForFreeShipping = eligibleForFreeShipping;
        this.freeShippingThreshold = 1999.0; // Can be made configurable
        this.amountToFreeShipping = eligibleForFreeShipping ? 0.0 : 
                                   Math.max(0.0, freeShippingThreshold - subtotal);
    }
}