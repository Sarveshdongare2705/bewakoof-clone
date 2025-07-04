// AddCartItemRequestDTO.java
package com.bewakoof.bewakoof.dto;

import lombok.Data;

@Data
public class AddCartItemRequestDTO {
    private Long productId;
    private Long colorId;
    private Long sizeId;
    private Long availId;
    private int quantity;
}
