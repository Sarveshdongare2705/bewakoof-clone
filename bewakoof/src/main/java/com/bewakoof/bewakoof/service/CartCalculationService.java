package com.bewakoof.bewakoof.service;

import com.bewakoof.bewakoof.model.*;
import org.springframework.stereotype.Component;

@Component
public class CartCalculationService {

    // checking quantity valid or not
    public boolean checkProductQuantityValid(CartItem item) {
        Product product = item.getProduct();

        ColorVariant matchedColor = product.getColorVariants().stream()
                .filter(c -> c.getColorName().equalsIgnoreCase(item.getColorVariant().getColorName()))
                .findFirst()
                .orElse(null);

        if (matchedColor == null)
            return false;

        SizeVariant matchedSize = matchedColor.getSizes().stream()
                .filter(s -> s.getSize().equalsIgnoreCase(item.getSizeVariant().getSize()))
                .findFirst()
                .orElse(null);

        if (matchedSize == null)
            return false;
            
        return item.getQuantity() <= matchedSize.getQuantity();
    }

    /**
     * Comprehensive cart calculation that maintains all pricing components
     */
    public void recalculateCart(Cart cart) {
        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            resetCartTotals(cart);
            return;
        }

        // 1. Calculate base amounts
        double subtotal = 0.0;
        double totalDeliveryCharge = 0.0;
        int totalQuantity = 0;

        for (CartItem item : cart.getCartItems()) {
            totalQuantity += item.getQuantity();

            // Calculate item total with combo offers
            ComboOfferResult comboResult = calculateComboOfferPrice(item.getProduct(), item.getQuantity());
            subtotal += comboResult.getTotalPrice();
            totalDeliveryCharge += item.getProductAvailability().getDeliveryCharge();
        }

        // 2. Set base amounts
        cart.setTotalQuantity(totalQuantity);
        cart.setSubtotal(subtotal);
        cart.setTotalDeliveryCharge(totalDeliveryCharge);
        cart.setMerchandiseTotal(subtotal + totalDeliveryCharge);

        // 3. Calculate discounts
        calculateDiscounts(cart);

        // 4. Calculate final amount
        cart.setFinalAmount(cart.getMerchandiseTotal() - cart.getCouponDiscount() - cart.getShippingDiscount());
    }

    private void calculateDiscounts(Cart cart) {
        // Reset discounts
        cart.setCouponDiscount(0.0);
        cart.setShippingDiscount(0.0);

        // Apply coupon discount
        if (cart.getAppliedCoupon() != null && cart.getAppliedCoupon().isActive()) {
            Coupon coupon = cart.getAppliedCoupon();
            if (cart.getSubtotal() >= coupon.getMinCartAmount()) {
                cart.setCouponDiscount(coupon.calculateDiscount(cart.getSubtotal()));
            }
        }

        // Apply free shipping discount
        if (cart.isEligibleForFreeShipping()) {
            cart.setShippingDiscount(cart.getTotalDeliveryCharge());
        }
    }

    private void resetCartTotals(Cart cart) {
        cart.setTotalQuantity(0);
        cart.setSubtotal(0.0);
        cart.setTotalDeliveryCharge(0.0);
        cart.setMerchandiseTotal(0.0);
        cart.setCouponDiscount(0.0);
        cart.setShippingDiscount(0.0);
        cart.setFinalAmount(0.0);
    }

    private ComboOfferResult calculateComboOfferPrice(Product product, int quantity) {
        if (!product.getHasComboOffer() || product.getComboQuantity() == null || product.getComboPrice() == null) {
            double totalPrice = product.getDiscountPrice() * quantity;
            return new ComboOfferResult(totalPrice, 0, quantity);
        }

        int comboQuantity = product.getComboQuantity();
        double comboPrice = product.getComboPrice();
        double regularPrice = product.getDiscountPrice();

        int comboSets = quantity / comboQuantity;
        int remainingItems = quantity % comboQuantity;

        double totalComboPrice = comboSets * comboPrice;
        double totalRemainingPrice = remainingItems * regularPrice;
        double totalPrice = totalComboPrice + totalRemainingPrice;

        return new ComboOfferResult(totalPrice, comboSets, remainingItems);
    }

    private static class ComboOfferResult {
        private final double totalPrice;
        private final int comboSetsUsed;
        private final int remainingItems;

        public ComboOfferResult(double totalPrice, int comboSetsUsed, int remainingItems) {
            this.totalPrice = totalPrice;
            this.comboSetsUsed = comboSetsUsed;
            this.remainingItems = remainingItems;
        }

        public double getTotalPrice() {
            return totalPrice;
        }

        public int getComboSetsUsed() {
            return comboSetsUsed;
        }

        public int getRemainingItems() {
            return remainingItems;
        }
    }
}