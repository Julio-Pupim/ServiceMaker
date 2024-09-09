package br.com.servicemaker;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SerivceMakerApplication {

	public static void main(String[] args) {
		SpringApplication.run(SerivceMakerApplication.class, args);
	}

}
