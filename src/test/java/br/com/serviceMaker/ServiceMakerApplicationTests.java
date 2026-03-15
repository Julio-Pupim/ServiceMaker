package br.com.serviceMaker;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.modulith.core.ApplicationModules;

@SpringBootTest
class ServiceMakerApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	void modulesVerify(){
		var modules = ApplicationModules.of(ServiceMakerApplication.class);
		System.out.println(modules);
		modules.verify();
	}
}
