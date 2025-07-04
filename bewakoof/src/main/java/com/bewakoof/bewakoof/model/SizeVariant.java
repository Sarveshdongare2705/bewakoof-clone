package com.bewakoof.bewakoof.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class SizeVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sizeId;

    @Column(nullable = false)
    private String size; // e.g., "S", "M", "L", "XL"

    @Column(nullable = false)
    private int quantity;
    
    private boolean available;

    @ManyToOne
    @JoinColumn(name = "color_id")
    @JsonBackReference("size")
    private ColorVariant colorVariant;
}
