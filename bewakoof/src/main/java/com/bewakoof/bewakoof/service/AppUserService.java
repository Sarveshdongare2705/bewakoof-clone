package com.bewakoof.bewakoof.service;

import com.bewakoof.bewakoof.enums.UserRole;
import com.bewakoof.bewakoof.model.AppUser;
import com.bewakoof.bewakoof.payload.ApiResponse;
import com.bewakoof.bewakoof.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AppUserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JWTService jwtservice;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private HttpServletResponse httpServletResponse;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public AppUser register(AppUser appUser) {
        String password = appUser.getPassword();
        appUser.setPassword(encoder.encode(appUser.getPassword()));
        if (appUser.getRole() == null) {
            appUser.setRole(UserRole.ROLE_USER);
        }
        // check if user already exists
        AppUser existingUser = userRepository.findByEmail(appUser.getEmail());
        if (existingUser != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists");
        }
        AppUser existinUser = userRepository.findByPhoneNo(appUser.getPhoneNo());
        if (existinUser != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists");
        }

        validateUser(appUser);
        // save the user in db
        AppUser user = userRepository.save(appUser);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.EXPECTATION_FAILED, "User could not be created");
        }

        // Generate token directly without authentication
        String jwtToken = jwtservice.generateToken(user.getEmail());
        Cookie cookie = new Cookie("token", jwtToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true in production mode
        cookie.setPath("/");
        cookie.setMaxAge(1 * 24 * 60 * 60); // 1 day
        httpServletResponse.addCookie(cookie);
        return user;
    }

    public AppUser authenticate(AppUser user) {
        AppUser existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Incorrect email and password");
        }
        Authentication auth = authManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

        if (auth.isAuthenticated()) {
            String jwtToken = jwtservice.generateToken(user.getEmail());
            Cookie cookie = new Cookie("token", jwtToken);
            cookie.setHttpOnly(true);
            cookie.setSecure(false); // true in production mode
            cookie.setPath("/");
            cookie.setMaxAge(1 * 24 * 60 * 60); // 1 day
            httpServletResponse.addCookie(cookie);
            AppUser savedUser = getUser(user.getEmail());
            return savedUser;
        } else {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Incorrect email and password");
        }
    }

    private AppUser getUser(String email) {
        return userRepository.findByEmail(email);
    }

    // update profile
    public AppUser updateUserData(String email, AppUser appUser) {
        AppUser savedUser = getUser(email);
        if (savedUser == null) {
            return null;
        }
        savedUser.setUserName(appUser.getUserName());
        savedUser.setPhoneNo(appUser.getPhoneNo());
        savedUser.setMobileNo(appUser.getMobileNo());
        savedUser.setGender(appUser.getGender());
        savedUser.setBirthDate(appUser.getBirthDate());
        AppUser user = userRepository.save(savedUser);
        return user;
    }

    // validate data
    private void validateUser(AppUser user) {
        if (user.getEmail() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        if (user.getPassword() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }
        if (user.getPhoneNo() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "PhoneNo is required");
        }
        if (user.getGender() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Gender is required");
        }
        if (user.getBirthDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "BirthDate is required");
        }
        if (user.getUserName() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "UserName is required");
        }
    }

    public AppUser getCurrentUser(UserDetails userDetails) {
        AppUser user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User does not exist");
        }
        return user;
    }
}
