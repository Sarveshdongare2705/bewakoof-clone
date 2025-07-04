package com.bewakoof.bewakoof.controller;

import com.bewakoof.bewakoof.model.AppUser;
import com.bewakoof.bewakoof.payload.ApiResponse;
import com.bewakoof.bewakoof.service.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
public class AppUserController {

    @Autowired
    private AppUserService appUserService;

    @PostMapping("/user/register")
    public AppUser register(@RequestBody AppUser appUser) {
        return appUserService.register(appUser);
    }
    @PostMapping("/user/login")
    public AppUser login(@RequestBody AppUser appUser) {
        return appUserService.authenticate(appUser);
    }
    @PutMapping("/update-profile")
    public AppUser updateProfile(@AuthenticationPrincipal UserDetails userDetails ,  @RequestBody AppUser updateData) {
        String email = userDetails.getUsername();
        return appUserService.updateUserData(email, updateData);
    }
    @GetMapping("/current-user")
    public AppUser getCurrentUser(@AuthenticationPrincipal UserDetails userDetails){
        return appUserService.getCurrentUser(userDetails);
    }
}
