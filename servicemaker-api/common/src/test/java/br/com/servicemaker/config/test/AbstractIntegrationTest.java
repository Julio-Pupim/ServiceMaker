package br.com.servicemaker.config.test;

import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@ActiveProfiles("test")
public abstract class AbstractIntegrationTest {

    @Container
    public static final PostgreSQLContainer<?> POSTGRESQL_CONTAINER;
    @LocalServerPort
    private Integer port;

    static {
        POSTGRESQL_CONTAINER = new PostgreSQLContainer<>("postgres:18-alpine")
                .withDatabaseName("servicemaker_test")
                .withUsername("testuser")
                .withPassword("testpass");

        POSTGRESQL_CONTAINER.start();

    }

    @DynamicPropertySource
    public static void setDatasourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRESQL_CONTAINER::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRESQL_CONTAINER::getUsername);
        registry.add("spring.datasource.password", POSTGRESQL_CONTAINER::getPassword);
    }
    @BeforeEach
    void setUpRestAssured() {
        RestAssured.port = port;
        RestAssured.basePath = "/"; // Opcional
    }
}
