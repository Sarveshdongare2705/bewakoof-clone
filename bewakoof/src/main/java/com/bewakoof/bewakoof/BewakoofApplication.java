package com.bewakoof.bewakoof;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.bewakoof.bewakoof.model")
public class BewakoofApplication {

	public static void main(String[] args) {
		SpringApplication.run(BewakoofApplication.class, args);
	}

}
