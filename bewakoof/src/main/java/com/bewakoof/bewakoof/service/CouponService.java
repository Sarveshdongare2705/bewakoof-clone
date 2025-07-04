package com.bewakoof.bewakoof.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.bewakoof.bewakoof.model.AppUser;
import com.bewakoof.bewakoof.model.Cart;
import com.bewakoof.bewakoof.model.Coupon;
import com.bewakoof.bewakoof.model.UserCouponUsage;
import com.bewakoof.bewakoof.repository.CartRepository;
import com.bewakoof.bewakoof.repository.CouponRepository;
import com.bewakoof.bewakoof.repository.UserCouponUsageRepository;
import com.bewakoof.bewakoof.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserCouponUsageRepository userCouponUsageRepository;

    @Autowired
    private CartCalculationService cartCalculationService;

    public List<Coupon> getAvailableCoupons(UserDetails userDetails) {
        String email = userDetails.getUsername();
        AppUser user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found with given email");
        }

        List<Long> usedCouponIds = userCouponUsageRepository.findByUser(user)
                .stream().map(usage -> usage.getCoupon().getCouponId()).toList();

        return couponRepository.findAllByActiveTrue().stream()
                .filter(coupon -> !coupon.isOneTimePerUser() || !usedCouponIds.contains(coupon.getCouponId()))
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean applyCoupon(UserDetails userDetails, Long cartId, Long couponId) {
        String email = userDetails.getUsername();
        AppUser user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found with given email");
        }

        Cart cart = cartRepository.findById(cartId).orElse(null);
        if (cart == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart not found");
        }

        // Check if another coupon is already applied
        if (cart.getAppliedCoupon() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only one coupon can be applied at a time");
        }

        Coupon coupon = couponRepository.findById(couponId).orElse(null);
        if (coupon == null || !coupon.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired coupon");
        }

        // Check if user has already used this one-time coupon
        if (coupon.isOneTimePerUser()) {
            boolean alreadyUsed = userCouponUsageRepository.existsByUserAndCoupon(user, coupon);
            if (alreadyUsed) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You have already used this coupon");
            }
        }

        // Ensure cart totals are up to date before validation
        cartCalculationService.recalculateCart(cart);

        // Check minimum cart amount (use subtotal, not final amount)
        if (cart.getSubtotal() < coupon.getMinCartAmount()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("Cart subtotal (₹%.2f) does not meet minimum amount (₹%.2f) for this coupon.",
                            cart.getSubtotal(), coupon.getMinCartAmount()));
        }

        // Apply coupon
        cart.setAppliedCoupon(coupon);
        
        // Recalculate cart with the new coupon
        cartCalculationService.recalculateCart(cart);
        cartRepository.save(cart);

        // Track coupon usage for one-time coupons
        if (coupon.isOneTimePerUser()) {
            UserCouponUsage usage = new UserCouponUsage();
            usage.setUser(user);
            usage.setCoupon(coupon);
            usage.setUsedAt(java.time.LocalDateTime.now());
            userCouponUsageRepository.save(usage);
        }

        return true;
    }

    @Transactional
    public boolean removeCoupon(UserDetails userDetails, Long cartId) {
        String email = userDetails.getUsername();
        AppUser user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found with given email");
        }

        Cart cart = cartRepository.findById(cartId).orElse(null);
        if (cart == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart not found");
        }

        Coupon appliedCoupon = cart.getAppliedCoupon();
        if (appliedCoupon != null) {
            // Remove coupon reference
            cart.setAppliedCoupon(null);

            // Remove usage tracking for one-time coupons
            if (appliedCoupon.isOneTimePerUser()) {
                UserCouponUsage usage = userCouponUsageRepository.findByUserAndCoupon(user, appliedCoupon);
                if (usage != null) {
                    userCouponUsageRepository.delete(usage);
                }
            }

            // Recalculate cart without coupon
            cartCalculationService.recalculateCart(cart);
            cartRepository.save(cart);
        }

        return true;
    }

    /**
     * Validate if a coupon can be applied to a cart
     */
    public boolean validateCouponForCart(Coupon coupon, Cart cart, AppUser user) {
        // Basic validations
        if (!coupon.isActive()) {
            return false;
        }

        if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            return false;
        }

        // Check if user has already used one-time coupon
        if (coupon.isOneTimePerUser() && userCouponUsageRepository.existsByUserAndCoupon(user, coupon)) {
            return false;
        }

        // Check minimum cart amount
        if (cart.getSubtotal() < coupon.getMinCartAmount()) {
            return false;
        }

        return true;
    }

    /**
     * Get coupon discount preview without applying
     */
    public double getCouponDiscountPreview(Long couponId, Long cartId) {
        Coupon coupon = couponRepository.findById(couponId).orElse(null);
        Cart cart = cartRepository.findById(cartId).orElse(null);
        
        if (coupon == null || cart == null) {
            return 0.0;
        }

        if (cart.getSubtotal() < coupon.getMinCartAmount()) {
            return 0.0;
        }

        return coupon.calculateDiscount(cart.getSubtotal());
    }

    // Admin methods
    public void createCoupon(Coupon coupon) {
        coupon.setExpiryDate(LocalDateTime.now());
        couponRepository.save(coupon);
    }

    public void deleteCoupon(Long id) {
        couponRepository.deleteById(id);
    }

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public void updateCouponStatus(Long couponId, boolean active) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coupon not found"));
        coupon.setActive(active);
        couponRepository.save(coupon);
    }
}