package com.bewakoof.bewakoof.repository;

import com.bewakoof.bewakoof.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<AppUser, Long> {

    AppUser findByEmail(String email);
    AppUser findByPhoneNo(String phoneNo);
}
