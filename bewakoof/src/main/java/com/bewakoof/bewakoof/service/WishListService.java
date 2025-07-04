package com.bewakoof.bewakoof.service;

import com.bewakoof.bewakoof.model.AppUser;
import com.bewakoof.bewakoof.model.Product;
import com.bewakoof.bewakoof.model.WishList;
import com.bewakoof.bewakoof.repository.ProductRepository;
import com.bewakoof.bewakoof.repository.UserRepository;
import com.bewakoof.bewakoof.repository.WishListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishListService {

    @Autowired
    private WishListRepository wishListRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getWishList(UserDetails userDetails) {
        String email = userDetails.getUsername();
        AppUser user = userRepository.findByEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        List<WishList> wishListEntries = wishListRepository.findByUser(user);
        return wishListEntries.stream()
                .map(WishList::getProduct)
                .toList();
    }

    public void addToWishList(UserDetails userDetails, Long productId) {
        String email = userDetails.getUsername();
        AppUser user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        Product product = productRepository.findById(productId).get();
        if (product == null) {
            throw new UsernameNotFoundException("Product not found with id: " + productId);
        }

        List<WishList> wishListEntries = wishListRepository.findByUser(user);
        boolean alreadyWished = false;
        alreadyWished = wishListEntries.stream().anyMatch(wishList -> wishList.getProduct().equals(product));

        if (alreadyWished) return;
        WishList wishList = new WishList();
        wishList.setUser(user);
        wishList.setProduct(product);
        wishListRepository.save(wishList);
    }

    public void removeFromWishList(UserDetails userDetails, Long productId) {
        String email = userDetails.getUsername();
        AppUser user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        WishList wishListEntry = wishListRepository.findByUserAndProduct(user, product);
        if (wishListEntry != null) {
            wishListRepository.delete(wishListEntry);
        }
    }

    public boolean isPresentWishList(UserDetails userDetails, Long productId) {
        String email = userDetails.getUsername();
        AppUser user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        WishList wishListEntry = wishListRepository.findByUserAndProduct(user, product);
        if (wishListEntry != null) {
            return true;
        }
        return false;

    }
}
