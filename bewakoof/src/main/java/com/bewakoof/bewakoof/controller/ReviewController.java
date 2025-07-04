package com.bewakoof.bewakoof.controller;

import com.bewakoof.bewakoof.model.Review;
import com.bewakoof.bewakoof.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/product/{productId}/review")
    public void addReview(@PathVariable Long productId, @RequestBody Review review , @AuthenticationPrincipal UserDetails userDetails) {
        reviewService.addReview(productId , review , userDetails);
    }

    @PutMapping("/product/{productId}/review/{reviewId}")
    public void updateReview(@PathVariable Long productId, @PathVariable Long reviewId, @RequestBody Review review, @AuthenticationPrincipal UserDetails userDetails) {
        reviewService.updateReview(productId, reviewId , review , userDetails);
    }

    @DeleteMapping("/product/{productId}/review/{reviewId}")
    public void deleteReview(@PathVariable Long productId , @PathVariable Long reviewId , @AuthenticationPrincipal UserDetails userDetails) {
        reviewService.deleteReview(productId , reviewId , userDetails);
    }
}
