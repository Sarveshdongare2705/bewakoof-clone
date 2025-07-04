package com.bewakoof.bewakoof.controller;

import com.bewakoof.bewakoof.model.Coupon;
import com.bewakoof.bewakoof.service.CouponService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @GetMapping("/available")
    public ResponseEntity<List<Coupon>> getAvailableCoupons(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(couponService.getAvailableCoupons(userDetails));
    }

    @PostMapping("/apply")
    public ResponseEntity<String> applyCoupon(@AuthenticationPrincipal UserDetails userDetails,
                                              @RequestParam Long cartId,
                                              @RequestParam Long couponId) {
        boolean success = couponService.applyCoupon(userDetails, cartId, couponId);
        return ResponseEntity.ok(success ? "Coupon applied successfully" : "Failed to apply coupon");
    }

    @PostMapping("/remove")
    public ResponseEntity<String> removeCoupon(@AuthenticationPrincipal UserDetails userDetails,
                                               @RequestParam Long cartId) {
        boolean success = couponService.removeCoupon(userDetails, cartId);
        return ResponseEntity.ok(success ? "Coupon removed successfully" : "Failed to remove coupon");
    }

    // Admin endpoints
    @PostMapping("/create")
    public ResponseEntity<String> createCoupon(@RequestBody Coupon coupon) {
        couponService.createCoupon(coupon);
        return ResponseEntity.ok("Coupon created successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok("Coupon deleted successfully");
    }
}  