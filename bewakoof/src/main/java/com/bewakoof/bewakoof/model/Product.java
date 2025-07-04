package com.bewakoof.bewakoof.model;

import com.bewakoof.bewakoof.enums.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Data
@AllArgsConstructor

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    private String productName;
    private String productDescription;
    private String productBrand;
    private Double productPrice;
    private Double discountPercent;
    private Double discountPrice;

    private String mainCategory;
    private String category;
    private String material;

    @Enumerated(EnumType.STRING)
    private Gender targetGender;

    @Enumerated(EnumType.STRING)
    private AgeGroup targetAgeGroup;

    @Enumerated(EnumType.STRING)
    private FitType fitType;

    @Enumerated(EnumType.STRING)
    private NeckType neckType;

    @Enumerated(EnumType.STRING)
    private SleeveType sleeveType;

    @Enumerated(EnumType.STRING)
    private DesignType designType;

    @Enumerated(EnumType.STRING)
    private Occasion occasion;

    @Column(nullable = false)
    private Boolean hasComboOffer;
    private String offerText;
    private Integer comboQuantity;
    private Double comboPrice;

    @Column(nullable = false)
    private Integer recentPurchases;
    @Column(nullable = false)
    private Double averageRating;
    @Column(nullable = false)
    private Integer totalReviews;
    @Column(nullable = false)
    private Integer soldCount;
    @Column(nullable = false)
    private Boolean isOfficialMerchandise;
    private String licenseInfo;

    private String slug;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ColorVariant> colorVariants;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("product")
    private List<Review> reviews;

    private Double recommendPercentage = 0.0;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("productAvailable")
    private List<ProductAvailability> availabilityZones;

    @PrePersist
    @PreUpdate
    public void calculateDiscountPrice() {
        if (discountPercent != null && productPrice != null) {
            this.discountPrice = productPrice - (productPrice * discountPercent / 100);
        } else {
            this.discountPrice = productPrice;
        }
        this.discountPrice = Math.round(this.discountPrice * 100.00) / 100.00;

        if (this.slug == null || this.slug.isEmpty()) {
            this.slug = generateSlug();
        }
    }

    private String generateSlug() {
        if (productName != null) {
            return productName.toLowerCase()
                    .replaceAll("[^a-z0-9\\s]", "")
                    .replaceAll("\\s+", "-");
        }
        return "";
    }

    public Product() {
    }
}
