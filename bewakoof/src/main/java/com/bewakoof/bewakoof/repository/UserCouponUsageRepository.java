package com.bewakoof.bewakoof.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bewakoof.bewakoof.model.AppUser;
import com.bewakoof.bewakoof.model.Coupon;
import com.bewakoof.bewakoof.model.UserCouponUsage;

public interface UserCouponUsageRepository extends JpaRepository<UserCouponUsage , Long> {

    List<UserCouponUsage> findByUser(AppUser user);
    boolean existsByUserAndCoupon(AppUser user , Coupon coupon);
    UserCouponUsage findByUserAndCoupon(AppUser user, Coupon coupon);

}
