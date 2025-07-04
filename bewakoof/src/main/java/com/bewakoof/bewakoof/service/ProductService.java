package com.bewakoof.bewakoof.service;

import com.bewakoof.bewakoof.enums.Gender;
import com.bewakoof.bewakoof.model.*;
import com.bewakoof.bewakoof.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ColorVariantRepository colorVariantRepository;

    @Autowired
    private SizeVariantRepository sizeVariantRepository;

    @Autowired
    private SearchHistoryRepository searchHistoryRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products;
    }

    public Product getProductById(Long id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product with given id does not exist");
        }
        return product;
    }

    public List<Product> getAllProductsByChoice(Boolean choice) {
        if (choice == null)
            return productRepository.findAll();

        List<Gender> genders = choice
                ? List.of(Gender.MEN, Gender.BOYS, Gender.UNISEX)
                : List.of(Gender.WOMEN, Gender.GIRLS, Gender.UNISEX);

        return productRepository.findByTargetGenderIn(genders);
    }

    public void addProduct(Product product) {
        Product savedProduct = productRepository.save(product);
    }

    public void updateProduct(Long id, Product updatedProduct) {
        Product existingProduct = productRepository.findById(id).orElse(null);
        if (existingProduct == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product with given id does not exist");
        }

        existingProduct.setProductName(updatedProduct.getProductName());
        existingProduct.setProductDescription(updatedProduct.getProductDescription());
        existingProduct.setProductBrand(updatedProduct.getProductBrand());
        existingProduct.setProductPrice(updatedProduct.getProductPrice());
        existingProduct.setDiscountPercent(updatedProduct.getDiscountPercent());
        productRepository.save(existingProduct);
    }

    public boolean deleteProduct(Long id) {
        Product existingProduct = productRepository.findById(id).orElse(null);
        if (existingProduct == null) {
            return false;
        }
        productRepository.delete(existingProduct);
        return true;
    }

    // color variants
    public void addColorVariant(Long productId, ColorVariant colorVariant) {
        Product existingProduct = productRepository.findById(productId).orElse(null);
        if (existingProduct == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product with given id does not exist");
        }
        colorVariant.setProduct(existingProduct);
        colorVariantRepository.save(colorVariant);
    }

    public void updateColorVariant(Long colorId, ColorVariant variant) {
        ColorVariant existingVariant = colorVariantRepository.findById(colorId).orElse(null);
        if (existingVariant == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Color variant with given id does not exist");
        }
        existingVariant.setColorName(variant.getColorName());
        colorVariantRepository.save(existingVariant);
    }

    public void deleteColorVariant(Long colorId) {
        ColorVariant existingVariant = colorVariantRepository.findById(colorId).orElse(null);
        if (existingVariant == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Color variant with given id does not exist");
        }
        Long productId = existingVariant.getProduct().getProductId();
        colorVariantRepository.delete(existingVariant);
    }

    public void addSizeVariant(Long variantId, SizeVariant sizeVariant) {
        ColorVariant colorVariant = colorVariantRepository.findById(variantId).orElse(null);
        if (colorVariant == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Color variant with given id does not exist");
        }
        sizeVariant.setColorVariant(colorVariant);
        sizeVariantRepository.save(sizeVariant);
    }

    public void updateSizeVariant(Long variantId, Long sizeId, SizeVariant updatedVariant) {
        SizeVariant existing = sizeVariantRepository.findById(sizeId).orElse(null);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Size variant with given id does not exist");
        }
        existing.setSize(updatedVariant.getSize());
        existing.setQuantity(updatedVariant.getQuantity());
        existing.setAvailable(updatedVariant.isAvailable());
        sizeVariantRepository.save(existing);
    }

    public void deleteSizeVariant(Long sizeId) {
        SizeVariant existing = sizeVariantRepository.findById(sizeId).orElse(null);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Size variant with given id does not exist");
        }
        sizeVariantRepository.delete(existing);
    }

    // search feature
    public List<Product> searchProducts(String searchedTerm, Boolean choice) {
        List<Product> matchedProducts = productRepository.searchByTerm(searchedTerm.toLowerCase());

        if (choice == null)
            return matchedProducts;

        List<Gender> genders = choice
                ? List.of(Gender.MEN, Gender.BOYS, Gender.UNISEX)
                : List.of(Gender.WOMEN, Gender.GIRLS, Gender.UNISEX);

        return matchedProducts.stream()
                .filter(product -> genders.contains(product.getTargetGender()))
                .collect(Collectors.toList());
    }

    public List<Product> getProductsByMerchandise(String merchTerm, Boolean choice) {
        if (merchTerm == null || merchTerm.trim().isEmpty())
            return List.of();

        Set<String> stopWords = Set.of(
                "the", "a", "an", "of", "in", "on", "and", "collection", "merchandise");

        String[] words = merchTerm.trim().toLowerCase().split("\\s+");
        Set<Product> matchedProducts = new HashSet<>();

        for (String word : words) {
            if (!stopWords.contains(word)) {
                List<Product> partialMatches = productRepository.findByMerchandiseTerm(word);
                matchedProducts.addAll(partialMatches);
            }
        }

        if (choice == null) {
            return new ArrayList<>(matchedProducts);
        }

        List<Gender> genders = choice
                ? List.of(Gender.MEN, Gender.BOYS, Gender.UNISEX)
                : List.of(Gender.WOMEN, Gender.GIRLS, Gender.UNISEX);

        return matchedProducts.stream()
                .filter(p -> genders.contains(p.getTargetGender()))
                .collect(Collectors.toList());
    }

    // get recent products based on search histroy
    public List<Product> getRecentProducts(UserDetails userDetails, Boolean choice) {
        String email = userDetails.getUsername();
        AppUser user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User does not exist");
        }

        List<SearchHistory> recentSearches = searchHistoryRepository.findTop5SearchOfUser(user);
        Set<Long> addedProductIds = new HashSet<>();

        List<Product> results = new ArrayList<>();

        for (SearchHistory history : recentSearches) {
            List<Product> matches = searchProducts(history.getText(), choice);
            for (Product product : matches) {
                if (addedProductIds.add(product.getProductId())) {
                    results.add(product);
                }
            }
        }
        return results;
    }
}
