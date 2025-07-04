package com.bewakoof.bewakoof.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.bewakoof.bewakoof.enums.AddressType;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long addressId;

    @Enumerated(EnumType.STRING)
    private AddressType addressType;

    private String phone;
    private String street;
    private String landmark;
    private String city;
    private String state;
    private String country;
    private Integer pincode;

    private Boolean isDefault;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference("address")
    private AppUser appUser;

    @PrePersist
    @PreUpdate
    public void setDefaultIfHome() {
        if (this.addressType == AddressType.HOME && this.isDefault == null) {
            this.isDefault = true;
        }
    }
}
