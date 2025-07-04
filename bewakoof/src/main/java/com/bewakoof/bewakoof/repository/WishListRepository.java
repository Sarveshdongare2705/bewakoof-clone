package com.bewakoof.bewakoof.repository;

import com.bewakoof.bewakoof.model.AppUser;
import com.bewakoof.bewakoof.model.Product;
import com.bewakoof.bewakoof.model.WishList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WishListRepository extends JpaRepository<WishList, Long> {
    List<WishList> findByUser(AppUser user);

    @Query("SELECT w FROM WishList w WHERE w.user = :user AND w.product = :product")
    WishList findByUserAndProduct(@Param("user") AppUser user, @Param("product") Product product);

}
