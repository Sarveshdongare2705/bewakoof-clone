package com.bewakoof.bewakoof.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
@Entity
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;
    private int rating;
    private String comment;
    private Boolean recommend;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference("product")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference("user")
    private AppUser user;

    private Date createdAt = new Date();


    public Review() {}
}
