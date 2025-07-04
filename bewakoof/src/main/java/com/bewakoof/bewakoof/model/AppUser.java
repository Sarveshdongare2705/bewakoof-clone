package com.bewakoof.bewakoof.model;

import com.bewakoof.bewakoof.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@Entity
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Column(nullable = false)
    private String userName;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String phoneNo;

    private String mobileNo;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private Date birthDate;

    private Integer age;

    @OneToMany(mappedBy = "appUser", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("address")
    private List<Address> addresses;

    public AppUser() {
    }

    @PrePersist
    @PreUpdate
    private void calculateAge() {
        if (birthDate != null) {
            LocalDate birth = birthDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            this.age = Period.between(birth, LocalDate.now()).getYears();
        }
    }
}
