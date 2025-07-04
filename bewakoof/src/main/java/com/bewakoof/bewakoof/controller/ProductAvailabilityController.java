package com.bewakoof.bewakoof.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bewakoof.bewakoof.model.ProductAvailability;
import com.bewakoof.bewakoof.service.ProductAvailabilityService;

@RestController
public class ProductAvailabilityController {

    @Autowired
    private ProductAvailabilityService service;

    @PostMapping("/avail/{productId}")
    public void addAvail(@PathVariable Long productId , @RequestParam("file") MultipartFile file){
        service.addEntriesFromCSV(file, productId);
    }
    @PutMapping("/avail/{productId}/{pincode}")
    public void updateAvail(@PathVariable Long productId , @PathVariable Integer pincode , @RequestBody ProductAvailability p){
        service.updateAvailability(productId, pincode, p);
    }
    @DeleteMapping("/avail/{productId}/{pincode}")
    public void deleteAvail(@PathVariable Long productId , @PathVariable Integer pincode){
        service.deleteAvailability(productId, pincode);
    }

    @GetMapping("/avail/{productId}/{pincode}")
    public ProductAvailability isAvailable(@PathVariable Long productId , @PathVariable Integer pincode){
        return service.isAvailable(productId, pincode);
    }
}
