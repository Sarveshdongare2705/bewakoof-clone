package com.bewakoof.bewakoof.repository;

import com.bewakoof.bewakoof.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {
}
