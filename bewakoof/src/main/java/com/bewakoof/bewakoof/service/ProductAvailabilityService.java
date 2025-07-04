package com.bewakoof.bewakoof.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.bewakoof.bewakoof.model.Product;
import com.bewakoof.bewakoof.model.ProductAvailability;
import com.bewakoof.bewakoof.repository.ProductAvailabilityRepository;
import com.bewakoof.bewakoof.repository.ProductRepository;

@Service
public class ProductAvailabilityService {

    @Autowired
    private ProductAvailabilityRepository productAvailabilityRepository;

    @Autowired
    private ProductRepository productRepository;

    public void addEntriesFromCSV(MultipartFile file, Long productId) {
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            Product p = productRepository.findById(productId).orElse(null);
            if (p == null) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Product with given id does not exist");
            }

            List<ProductAvailability> entries = new ArrayList<>();
            String line;
            boolean skipHeader = true;

            while((line = reader.readLine()) != null ){
                if(skipHeader){
                    skipHeader = false;
                    continue;
                }
                String[] parts = line.split(",");
                if(parts.length != 4) continue;

                //add
                ProductAvailability pa = new ProductAvailability();
                pa.setPincode(Integer.parseInt(parts[0].trim()));
                pa.setDeliveryCharge(Double.parseDouble(parts[1].trim()));
                pa.setEstimatedDeliveryDays(Integer.parseInt(parts[2].trim()));
                pa.setReturnDays(Integer.parseInt(parts[3].trim()));
                pa.setProduct(p);
                entries.add(pa);
            }
            productAvailabilityRepository.saveAll(entries);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An error occured while inserting data");
        }
    }
    public void updateAvailability(Long productId, Integer pincode, ProductAvailability updated) {
        Product p = productRepository.findById(productId).orElse(null);
        if (p == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product with given id does not exist");
        }
        ProductAvailability existing = productAvailabilityRepository.findByProduct_ProductIdAndPincode(p, pincode).orElseThrow(() -> new RuntimeException("Availability not found"));
        existing.setDeliveryCharge(updated.getDeliveryCharge());
        existing.setEstimatedDeliveryDays(updated.getEstimatedDeliveryDays());
        existing.setReturnDays(updated.getReturnDays());
        productAvailabilityRepository.save(existing);
    }

    public void deleteAvailability(Long productId, Integer pincode) {
        Product p = productRepository.findById(productId).orElse(null);
        if (p == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product with given id does not exist");
        }
        ProductAvailability existing = productAvailabilityRepository.findByProduct_ProductIdAndPincode(p, pincode).orElseThrow(() -> new RuntimeException("Availability not found"));
        productAvailabilityRepository.delete(existing);
    }


    //checking if available or not
    public ProductAvailability isAvailable(Long productId , Integer pincode){
        Product p = productRepository.findById(productId).orElse(null);
        if (p == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product with given id does not exist");
        }
        ProductAvailability existing = productAvailabilityRepository.findByProduct_ProductIdAndPincode(p, pincode).orElse(null);
        if(existing == null){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product availability does not exist");
        }
        return existing;
    }
}
