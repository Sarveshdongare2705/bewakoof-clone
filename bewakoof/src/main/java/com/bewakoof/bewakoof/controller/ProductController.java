package com.bewakoof.bewakoof.controller;

import com.bewakoof.bewakoof.model.ColorVariant;
import com.bewakoof.bewakoof.model.Product;
import com.bewakoof.bewakoof.model.SizeVariant;
import com.bewakoof.bewakoof.service.ImageService;
import com.bewakoof.bewakoof.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ImageService imageService;

    // product endpoints

    @GetMapping("/products/all")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/products")
    public List<Product> getAllProducts(@RequestParam(required = false) Boolean choice) {
        return productService.getAllProductsByChoice(choice);
    }

    @GetMapping("/product/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @PostMapping("/products/add")
    public void addProduct(@RequestBody Product product) {
        productService.addProduct(product);
    }

    @PutMapping("/product/{id}")
    public void updateProduct(@PathVariable Long id, @RequestBody Product product) {
        productService.updateProduct(id, product);
    }

    @DeleteMapping("/product/{id}")
    public boolean deleteProduct(@PathVariable Long id) {
        return productService.deleteProduct(id);
    }

    // color variant endpoints
    @PostMapping("/product/{productId}/colors")
    public void addProductColors(@PathVariable Long productId, @RequestBody ColorVariant variant) {
        productService.addColorVariant(productId, variant);
    }

    @PutMapping("/colors/{colorId}")
    public void updateProductColors(@PathVariable Long colorId, @RequestBody ColorVariant variant) {
        productService.updateColorVariant(colorId, variant);
    }

    @DeleteMapping("/colors/{colorId}")
    public void deleteProductColors(@PathVariable Long colorId) {
        productService.deleteColorVariant(colorId);
    }

    // images
    @PostMapping("/color/{colorVariantId}/image")
    public void addProductImage(@PathVariable Long colorVariantId, @RequestPart MultipartFile file) {
        imageService.uploadImage(colorVariantId, file);
    }

    @DeleteMapping("/images/{imageId}")
    public void deleteProductImage(@PathVariable Long imageId) {
        imageService.deleteImage(imageId);
    }

    @PostMapping("/color/{variantId}/size")
    public void addSizeVariant(@PathVariable Long variantId, @RequestBody SizeVariant sizeVariant) {
        productService.addSizeVariant(variantId, sizeVariant);
    }

    @PutMapping("/color/{variantId}/size/{sizeId}")
    public void updateSizeVariant(
            @PathVariable Long variantId,
            @PathVariable Long sizeId,
            @RequestBody SizeVariant sizeVariant) {
        productService.updateSizeVariant(variantId, sizeId, sizeVariant);
    }

    @DeleteMapping("/color/size/{sizeId}")
    public void deleteSizeVariant(@PathVariable Long sizeId) {
        productService.deleteSizeVariant(sizeId);
    }

    @GetMapping("/search/products/{searchTerm}")
    public List<Product> searchProducts(@PathVariable String searchTerm,
            @RequestParam(required = false) Boolean choice) {
        return productService.searchProducts(searchTerm, choice);
    }

    @GetMapping("/products/merchandise/{term}")
    public List<Product> getByMerchandise(
            @PathVariable String term,
            @RequestParam(required = false) Boolean choice) {
        return productService.getProductsByMerchandise(term, choice);
    }

    @GetMapping("/recent-products")
    public List<Product> getRecentProducts(@AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Boolean choice) {
        return productService.getRecentProducts(userDetails, choice);
    }

}
