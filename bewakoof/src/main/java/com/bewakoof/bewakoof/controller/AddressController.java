package com.bewakoof.bewakoof.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.bewakoof.bewakoof.model.Address;
import com.bewakoof.bewakoof.model.AppUser;
import com.bewakoof.bewakoof.service.AddressService;

@RestController
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PostMapping("/address")
    public AppUser addAddress(@AuthenticationPrincipal UserDetails userDetails , @RequestBody Address address){
        return addressService.add(userDetails , address);
    }

    @PutMapping("/address/{addressId}")
    public AppUser updateAddress(@AuthenticationPrincipal UserDetails userDetails , @PathVariable Long addressId , @RequestBody Address address){
        return addressService.update(userDetails , addressId , address);
    }

    @DeleteMapping("/address/{addressId}")
    public AppUser deleteAddress(@AuthenticationPrincipal UserDetails userDetails , @PathVariable Long addressId){
        return addressService.delete(userDetails , addressId);
    }

    @PutMapping("/address/set-current/{addressId}")
    public AppUser setCurrentAddress(@AuthenticationPrincipal UserDetails userDetails , @PathVariable Long addressId){
        return addressService.setCurrentAddress(userDetails , addressId);
    }
}
