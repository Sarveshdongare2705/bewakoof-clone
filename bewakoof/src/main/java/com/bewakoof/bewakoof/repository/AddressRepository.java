package com.bewakoof.bewakoof.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bewakoof.bewakoof.enums.AddressType;
import com.bewakoof.bewakoof.model.Address;
import com.bewakoof.bewakoof.model.AppUser;

public interface AddressRepository extends JpaRepository<Address , Long> {
    
    @Query("SELECT a FROM Address a WHERE a.appUser = :user AND a.addressType = :type")
    public Optional<Address> findFirstByAppUserAndAddressType(AppUser user, AddressType type);


}
