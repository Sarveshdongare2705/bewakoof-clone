package com.bewakoof.bewakoof.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.bewakoof.bewakoof.model.Address;
import com.bewakoof.bewakoof.model.AppUser;
import com.bewakoof.bewakoof.model.Cart;
import com.bewakoof.bewakoof.repository.AddressRepository;
import com.bewakoof.bewakoof.repository.CartRepository;
import com.bewakoof.bewakoof.repository.UserRepository;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    CartRepository cartRepository;

    public AppUser add(UserDetails userDetails, Address address) {
        AppUser user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User does not exist");
        }

        Address existing = addressRepository
                .findFirstByAppUserAndAddressType(user, address.getAddressType())
                .orElse(null);

        if (existing == null) {
            address.setAppUser(user);
            addressRepository.save(address);
        } else {
            // just update dont add new . ex : duplicate home
            update(userDetails, existing.getAddressId(), address);
        }
        return user;
    }

    public AppUser update(UserDetails userDetails, Long addressId, Address address) {
        AppUser user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User does not exist");
        }
        Address existingAddress = addressRepository.findById(addressId).orElse(null);
        if (existingAddress == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Address module does not exist");
        }
        existingAddress.setPhone(address.getPhone());
        existingAddress.setStreet(address.getStreet());
        existingAddress.setLandmark(address.getLandmark());
        existingAddress.setCity(address.getCity());
        existingAddress.setState(address.getState());
        existingAddress.setCountry(address.getCountry());
        existingAddress.setPincode(address.getPincode());
        addressRepository.save(existingAddress);
        return user;
    }

    public AppUser delete(UserDetails userDetails, Long addressId) {
        AppUser user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User does not exist");
        }
        Address existingAddress = addressRepository.findById(addressId).orElse(null);
        if (existingAddress == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Address module does not exist");
        }
        addressRepository.delete(existingAddress);
        return user;
    }

    public AppUser setCurrentAddress(UserDetails userDetails, Long addressId) {
        AppUser user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User does not exist");
        }

        Address selectedAddress = addressRepository.findById(addressId).orElse(null);
        if (selectedAddress == null || !selectedAddress.getAppUser().getUserId().equals(user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Address does not belong to user");
        }

        for (Address addr : user.getAddresses()) {
            addr.setIsDefault(false);
            addressRepository.save(addr);
        }

        selectedAddress.setIsDefault(true);
        addressRepository.save(selectedAddress);

        Cart cart = cartRepository.findByAppUser_UserId(user.getUserId()).orElse(null);
        if (cart != null) {
            cart.setSelectedAddress(selectedAddress);
            cartRepository.save(cart);

            // Trigger revalidation after address change
            cartService.revalidateCartItemsForPincode(cart, selectedAddress.getPincode());
        }

        return user;
    }
}
