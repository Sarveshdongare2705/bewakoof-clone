package com.bewakoof.bewakoof.dto;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class CartSummaryDTO {
    private Double totalPrice;
    private Double totalSavings;
    private Double totalDeliveryCharges;
    private Double finalAmount;

    public CartSummaryDTO(Double totalPrice , Double totalSavings , Double totalDeliveryCharges){
        this.totalPrice = totalPrice;
        this.totalSavings = totalSavings;
        this.totalDeliveryCharges = totalDeliveryCharges;
    }
    
    @PrePersist
    @PreUpdate
    public void calculateFinalAmount(){
        this.finalAmount = this.totalPrice + this.totalDeliveryCharges;
    }
}
