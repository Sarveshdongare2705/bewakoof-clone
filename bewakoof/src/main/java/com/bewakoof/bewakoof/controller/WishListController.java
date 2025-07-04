package com.bewakoof.bewakoof.controller;

import com.bewakoof.bewakoof.model.Product;
import com.bewakoof.bewakoof.model.WishList;
import com.bewakoof.bewakoof.repository.WishListRepository;
import com.bewakoof.bewakoof.service.WishListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class WishListController {

    @Autowired
    private WishListService wishListService;

    @GetMapping("/wishlist")
    public List<Product> getWishList(@AuthenticationPrincipal   UserDetails userDetails) {
        return wishListService.getWishList(userDetails);
    }

    @PostMapping ("/wishlist/{productId}")
    public void setWishList(@AuthenticationPrincipal UserDetails userDetails , @PathVariable Long productId) {
        wishListService.addToWishList(userDetails, productId);
    }
    @DeleteMapping("/wishlist/{productId}")
    public void deleteWishList(@AuthenticationPrincipal UserDetails userDetails , @PathVariable Long productId) {
        wishListService.removeFromWishList(userDetails, productId);
    }

    @GetMapping("/wishlist/isPresent/{productId}")
    public boolean isProductPresent(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long productId) {
        boolean isPresent = wishListService.isPresentWishList(userDetails, productId);
        return isPresent;
    }
}
