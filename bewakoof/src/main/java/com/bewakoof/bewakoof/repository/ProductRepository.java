package com.bewakoof.bewakoof.repository;

import com.bewakoof.bewakoof.enums.Gender;
import com.bewakoof.bewakoof.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE LOWER(p.productName) LIKE %:term% " +
            "OR LOWER(p.productDescription) LIKE %:term% " +
            "OR LOWER(p.category) LIKE %:term% " +
            "OR LOWER(p.productBrand) LIKE %:term% " +
            "OR LOWER(p.designType) LIKE %:term% " +
            "OR LOWER(p.fitType) LIKE %:term% " +
            "OR LOWER(p.occasion) LIKE %:term% " +
            "OR LOWER(p.neckType) LIKE %:term% " +
            "OR LOWER(p.targetGender) LIKE %:term% " +
            "OR LOWER(p.targetAgeGroup) LIKE %:term%")
    List<Product> searchByTerm(@Param("term") String term);

    List<Product> findByTargetGenderIn(List<Gender> genders);

    @Query("SELECT p FROM Product p WHERE " +
            "(LOWER(p.productName) LIKE %:term% " +
            "OR LOWER(p.productDescription) LIKE %:term% " +
            "OR LOWER(p.productBrand) LIKE %:term% " +
            "OR LOWER(p.licenseInfo) LIKE %:term%)")
    List<Product> findByMerchandiseTerm(@Param("term") String term);
}
