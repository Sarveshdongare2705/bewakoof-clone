package com.bewakoof.bewakoof.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bewakoof.bewakoof.model.Coupon;

public interface CouponRepository extends JpaRepository<Coupon , Long> {

    List<Coupon> findAllByActiveTrue();
    Optional<Coupon> findByCode(String code);
}
