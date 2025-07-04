package com.bewakoof.bewakoof.repository;

import com.bewakoof.bewakoof.model.AppUser;
import com.bewakoof.bewakoof.model.Product;
import com.bewakoof.bewakoof.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Review findByProductAndUser(Product product, AppUser user);

    List<Review> findByProduct(Product product);
}
