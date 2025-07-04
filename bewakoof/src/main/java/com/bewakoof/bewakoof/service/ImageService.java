package com.bewakoof.bewakoof.service;

import com.bewakoof.bewakoof.model.ColorVariant;
import com.bewakoof.bewakoof.model.Image;
import com.bewakoof.bewakoof.repository.ColorVariantRepository;
import com.bewakoof.bewakoof.repository.ImageRepository;
import com.bewakoof.bewakoof.repository.ProductRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ImageService {

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ColorVariantRepository colorVariantRepository;

    public void uploadImage(Long colorVariantId, MultipartFile file) {
        ColorVariant variant = colorVariantRepository.findById(colorVariantId)
                .orElseThrow(() -> new RuntimeException("Color Variant not found with id: " + colorVariantId));

        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());

            Image image = new Image();
            image.setUrl((String) uploadResult.get("secure_url"));
            image.setPublicId((String) uploadResult.get("public_id"));
            image.setColorVariant(variant);

            imageRepository.save(image);
            variant.getImages().add(image);
            colorVariantRepository.save(variant);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image to Cloudinary", e);
        }
    }
    public void deleteImage(Long imageId) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found with id: " + imageId));

        try {
            cloudinary.uploader().destroy(image.getPublicId(), ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image from Cloudinary", e);
        }

        ColorVariant variant = image.getColorVariant();
        variant.getImages().remove(image);
        imageRepository.delete(image);
    }
}