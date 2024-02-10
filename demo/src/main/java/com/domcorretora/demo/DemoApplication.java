package com.domcorretora.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
		System.out.println("Spring Boot Version: 3.2.2 ");
		System.out.println("Java Project: Maven ");
		System.out.println("Java Version: 21 LTS ");
		System.out.println("Dependencies: ");
		System.out.println("Spring Data JPA ");
		System.out.println("Spring Web ");
		System.out.println("Liquidbase Migration ");
		System.out.println("Lombok ");
		System.out.println("Spring Security ");
	}

}
