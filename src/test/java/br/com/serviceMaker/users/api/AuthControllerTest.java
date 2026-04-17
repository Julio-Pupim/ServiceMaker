package br.com.serviceMaker.users.api;

import br.com.serviceMaker.shared.Email;
import br.com.serviceMaker.users.application.DeactivateUserUseCase;
import br.com.serviceMaker.users.application.RegisterUserUseCase;
import br.com.serviceMaker.users.application.command.DeactivateUserCommand;
import br.com.serviceMaker.users.application.command.RegisterUserCommand;
import br.com.serviceMaker.users.domain.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureTestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestRestTemplate
@Testcontainers
class AuthControllerTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17-alpine");

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private RegisterUserUseCase registerUserUseCase;

    @Autowired
    private DeactivateUserUseCase deactivateUserUseCase;

    @Autowired
    private UserRepository userRepository;

    @Test
    void should_login_and_return_access_token() {
        registerUserUseCase.execute(new RegisterUserCommand(
                "login_test@example.com",
                "12345678901",
                "SenhaForte123!",
                "Login Test User"
        ));

        LoginRequest request = new LoginRequest("login_test@example.com", "SenhaForte123!");

        ResponseEntity<LoginResponse> response = restTemplate.postForEntity(
                "/api/auth/login", request, LoginResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().accessToken()).isNotBlank();
        assertThat(response.getBody().expiresInSeconds()).isEqualTo(3600);
    }

    @Test
    void should_return_401_on_wrong_password() {
        registerUserUseCase.execute(new RegisterUserCommand(
                "wrong_pass@example.com",
                "98765432100",
                "SenhaForte123!",
                "Wrong Pass User"
        ));

        LoginRequest request = new LoginRequest("wrong_pass@example.com", "SenhaErrada!");

        ResponseEntity<ErrorResponse> response = restTemplate.postForEntity(
                "/api/auth/login", request, ErrorResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void should_return_401_on_unknown_email() {
        LoginRequest request = new LoginRequest("nonexistent@example.com", "SenhaForte123!");

        ResponseEntity<ErrorResponse> response = restTemplate.postForEntity(
                "/api/auth/login", request, ErrorResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void should_return_403_on_inactive_user_login() {
        registerUserUseCase.execute(new RegisterUserCommand(
                "inactive_user@example.com",
                "11122233344",
                "SenhaForte123!",
                "Inactive User"
        ));

        var user = userRepository.findByEmail(Email.of("inactive_user@example.com")).orElseThrow();
        deactivateUserUseCase.execute(new DeactivateUserCommand(user.getId()));

        LoginRequest request = new LoginRequest("inactive_user@example.com", "SenhaForte123!");

        ResponseEntity<ErrorResponse> response = restTemplate.postForEntity(
                "/api/auth/login", request, ErrorResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }
}
