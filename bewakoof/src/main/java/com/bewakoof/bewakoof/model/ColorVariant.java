package com.bewakoof.bewakoof.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@Entity
public class ColorVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long colorId;
    private String colorName;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference
    private Product product;

    //images
    @OneToMany(mappedBy = "colorVariant" , cascade = CascadeType.ALL , orphanRemoval = true)
    @JsonManagedReference("image")
    private List<Image> images;

    @OneToMany(mappedBy = "colorVariant", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("size")
    private List<SizeVariant> sizes;

    public ColorVariant() {}

}
