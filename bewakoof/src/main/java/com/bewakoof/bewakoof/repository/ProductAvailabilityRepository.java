package com.bewakoof.bewakoof.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bewakoof.bewakoof.model.Product;
import com.bewakoof.bewakoof.model.ProductAvailability;

public interface ProductAvailabilityRepository extends JpaRepository<ProductAvailability , Long> {

    @Query("SELECT p FROM ProductAvailability p WHERE p.product = :product AND p.pincode = :pincode")
    Optional<ProductAvailability> findByProduct_ProductIdAndPincode(Product product, Integer pincode);
}
