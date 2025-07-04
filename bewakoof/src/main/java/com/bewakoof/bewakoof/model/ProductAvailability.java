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
public class ProductAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long availId;
    private Integer pincode;
    private Double deliveryCharge;
    private Integer estimatedDeliveryDays;
    private Integer returnDays;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference("productAvailable")
    private Product product;
}
