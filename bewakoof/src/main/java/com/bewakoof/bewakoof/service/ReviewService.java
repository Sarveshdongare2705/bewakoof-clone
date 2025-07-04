package com.bewakoof.bewakoof.service;

import com.bewakoof.bewakoof.model.AppUser;
import com.bewakoof.bewakoof.model.Product;
import com.bewakoof.bewakoof.model.Review;
import com.bewakoof.bewakoof.repository.ProductRepository;
import com.bewakoof.bewakoof.repository.ReviewRepository;
import com.bewakoof.bewakoof.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public void addReview(Long productId, Review review, UserDetails userDetails) {
        Product p = productRepository.findById(productId).orElse(null);
        if (p == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product with given id does not exist");
        }
        AppUser user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User does not exist");
        }
        review.setProduct(p);
        review.setUser(user);
        reviewRepository.save(review);
        updateProductRatingAndReviews(p);
        updateRecommendPercentage(p);
    }

    public void updateReview(Long productId, Long reviewId, Review review, UserDetails userDetails) {
        Product p = productRepository.findById(productId).orElse(null);
        if (p == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product with given id does not exist");
        }
        AppUser user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User does not exist");
        }

        Review existingReview = reviewRepository.findById(reviewId).orElse(null);
        if (existingReview == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Review with given id does not exist");
        }
        existingReview.setRating(review.getRating());
        existingReview.setComment(review.getComment());
        existingReview.setProduct(p);
        existingReview.setUser(user);
        reviewRepository.save(existingReview);
        updateProductRatingAndReviews(p);
        updateRecommendPercentage(p);
    }

    public void deleteReview(Long productId, Long reviewId, UserDetails userDetails) {
        Product p = productRepository.findById(productId).orElse(null);
        if (p == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product does not exist");
        }
        AppUser user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User does not exist");
        }
        Review existingReview = reviewRepository.findById(reviewId).orElse(null);
        if (existingReview == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Review does not exist");
        }
        reviewRepository.deleteById(reviewId);
        updateProductRatingAndReviews(p);
        updateRecommendPercentage(p);
    }

    private void updateProductRatingAndReviews(Product product) {
        List<Review> reviews = reviewRepository.findByProduct(product);
        int totalReviews = reviews.size();
        double averageRating = 0.0;

        if (totalReviews > 0) {
            averageRating = reviews.stream()
                    .mapToDouble(Review::getRating)
                    .average()
                    .orElse(0.0);
        }

        product.setTotalReviews(totalReviews);
        product.setAverageRating(averageRating);
        productRepository.save(product);
    }

    public void updateRecommendPercentage(Product product) {
        List<Review> reviews = product.getReviews();
        if (reviews == null || reviews.isEmpty()) {
            product.setRecommendPercentage(0.0);
            return;
        }

        long recommendedCount = reviews.stream()
                .filter(Review::getRecommend)
                .count();

        double percentage = (recommendedCount * 100.0) / reviews.size();
        percentage = Math.round(percentage * 100.0) / 100.0;

        product.setRecommendPercentage(percentage);
        productRepository.save(product); // assuming you use Spring Data JPA
    }

}
