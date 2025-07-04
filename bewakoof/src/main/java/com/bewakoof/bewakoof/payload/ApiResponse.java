package com.bewakoof.bewakoof.payload;

import lombok.Data;

@Data
public class ApiResponse<T> {
    private T data;
    private String message;
    private int statusCode;

    public ApiResponse() {}

    public ApiResponse(T data, String message, int statusCode) {
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
    }
}

