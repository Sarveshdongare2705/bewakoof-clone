package com.bewakoof.bewakoof.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Data
@AllArgsConstructor
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;
    private String url;
    private String publicId;


    @ManyToOne
    @JoinColumn(name = "color_id")
    @JsonBackReference("image")
    private ColorVariant colorVariant;


    public Image() {}
}
