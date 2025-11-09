package br.com.servicemaker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "br.com.servicemaker")
public class ServiceMakerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServiceMakerApplication.class, args);
	}

}
