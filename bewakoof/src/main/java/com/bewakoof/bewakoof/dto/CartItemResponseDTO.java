package com.bewakoof.bewakoof.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponseDTO {
    private Long cartItemId;
    private int quantity;
     private boolean validQuantity;

    // Product Info
    private Long productId;
    private String productName;
    private Double productPrice;
    private Double discountPrice;
    private Double savings;
    private Double totalProductPrice;
    private Double totalDiscountPrice;
    private Double totalSavings;
    private Boolean hasComboOffer;
    private String offerText;
    private Integer comboQuantity;
    private Double comboPrice;

    // Color Info
    private Long colorId;
    private String colorName;
    private String productImage;

    // Size Info
    private Long sizeId;
    private String sizeLabel;

    // Availability Info
    private Long availabilityId;
    private Integer pincode;
    private Double deliveryCharge;
    private Integer estimatedDeliveryDays;
    private Integer returnDays;

    // Total Price (discount + delivery)
    private Double totalPrice;

}
