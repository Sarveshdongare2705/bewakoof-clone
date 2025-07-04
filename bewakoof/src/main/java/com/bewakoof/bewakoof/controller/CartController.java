package com.bewakoof.bewakoof.controller;

import com.bewakoof.bewakoof.dto.AddCartItemRequestDTO;
import com.bewakoof.bewakoof.dto.CartResponseDTO;
import com.bewakoof.bewakoof.dto.CartSummaryDTO;
import com.bewakoof.bewakoof.model.CartItem;
import com.bewakoof.bewakoof.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/cart")
    public CartResponseDTO getCart(@AuthenticationPrincipal UserDetails userDetails){
        return cartService.getCartItems(userDetails);
    }
    @PostMapping("/cart")
    public boolean addToCart(@AuthenticationPrincipal UserDetails userDetails, @RequestBody AddCartItemRequestDTO requestDTO){
        return cartService.addCartItem(userDetails , requestDTO);
    }

    @DeleteMapping("/cart/cart-item/{id}")
    public boolean deleteCartItem(@AuthenticationPrincipal UserDetails userDetails, @PathVariable("id") Long cartItemId){
        return cartService.deleteCartItem(userDetails , cartItemId);
    }

    @GetMapping("/cart-validate")
    public boolean validateCartBeforeCheckoutofCart(@AuthenticationPrincipal UserDetails userDetails){
        return cartService.validateCartBeforeCheckout(userDetails);
    }
}
