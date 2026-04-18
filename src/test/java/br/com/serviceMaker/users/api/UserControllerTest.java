package br.com.serviceMaker.users.api;

import br.com.serviceMaker.shared.UserId;
import br.com.serviceMaker.users.infra.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureTestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestRestTemplate
@Testcontainers
class UserControllerTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17-alpine");

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private JwtService jwtService;

    // -------------------------------------------------------------------------
    // Helper
    // -------------------------------------------------------------------------

    private UserId registerAndGetUserId(String email, String cpf, String password, String name) {
        RegisterUserRequest request = new RegisterUserRequest(email, cpf, password, name);
        ResponseEntity<UserIdResponse> response = restTemplate.postForEntity("/api/users", request, UserIdResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        return new UserId(response.getBody().id());
    }

    private HttpHeaders bearerHeaders(UserId userId) {
        String token = jwtService.generateToken(userId);
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        return headers;
    }

    // -------------------------------------------------------------------------
    // POST /api/users (public)
    // -------------------------------------------------------------------------

    @Test
    void should_register_user_and_return_201() {
        RegisterUserRequest request = new RegisterUserRequest(
                "register_201@example.com", "10000000001", "SenhaForte123!", "Test User");

        ResponseEntity<UserIdResponse> response = restTemplate.postForEntity("/api/users", request, UserIdResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().id()).isNotNull();
    }

    @Test
    void should_return_409_when_email_already_exists() {
        RegisterUserRequest request = new RegisterUserRequest(
                "duplicate_email@example.com", "20000000002", "SenhaForte123!", "Dup User");
        restTemplate.postForEntity("/api/users", request, UserIdResponse.class);

        RegisterUserRequest duplicate = new RegisterUserRequest(
                "duplicate_email@example.com", "30000000003", "SenhaForte123!", "Dup User 2");
        ResponseEntity<ErrorResponse> response = restTemplate.postForEntity("/api/users", duplicate, ErrorResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    }

    @Test
    void should_return_400_when_request_body_invalid() {
        RegisterUserRequest request = new RegisterUserRequest("", "", "", "");

        ResponseEntity<ErrorResponse> response = restTemplate.postForEntity("/api/users", request, ErrorResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    // -------------------------------------------------------------------------
    // POST /api/users/me/provider-profile (protected)
    // -------------------------------------------------------------------------

    @Test
    void should_return_401_when_no_jwt_on_protected_endpoint() {
        CreateProviderProfileRequest request = new CreateProviderProfileRequest("I fix plumbing");

        ResponseEntity<Void> response = restTemplate.postForEntity(
                "/api/users/me/provider-profile", request, Void.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void should_create_provider_profile_and_return_201() {
        UserId userId = registerAndGetUserId(
                "provider_201@example.com", "40000000004", "SenhaForte123!", "Provider User");

        CreateProviderProfileRequest request = new CreateProviderProfileRequest("I fix plumbing");
        HttpEntity<CreateProviderProfileRequest> entity = new HttpEntity<>(request, bearerHeaders(userId));

        ResponseEntity<Void> response = restTemplate.exchange(
                "/api/users/me/provider-profile", HttpMethod.POST, entity, Void.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }

    @Test
    void should_return_403_when_user_is_inactive() {
        UserId userId = registerAndGetUserId(
                "inactive_403@example.com", "50000000005", "SenhaForte123!", "Inactive User");

        // Deactivate the user first
        HttpEntity<Void> deactivateEntity = new HttpEntity<>(bearerHeaders(userId));
        restTemplate.exchange("/api/users/me/deactivate", HttpMethod.PATCH, deactivateEntity, Void.class);

        // Now try to create a provider profile — should be 403
        CreateProviderProfileRequest request = new CreateProviderProfileRequest("I fix plumbing");
        HttpEntity<CreateProviderProfileRequest> entity = new HttpEntity<>(request, bearerHeaders(userId));

        ResponseEntity<ErrorResponse> response = restTemplate.exchange(
                "/api/users/me/provider-profile", HttpMethod.POST, entity, ErrorResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    // -------------------------------------------------------------------------
    // PATCH /api/users/me/password (protected)
    // -------------------------------------------------------------------------

    @Test
    void should_change_password_and_return_204() {
        UserId userId = registerAndGetUserId(
                "change_pass@example.com", "60000000006", "SenhaForte123!", "Change Pass User");

        ChangePasswordRequest request = new ChangePasswordRequest("SenhaForte123!", "NovaSenha456!");
        HttpEntity<ChangePasswordRequest> entity = new HttpEntity<>(request, bearerHeaders(userId));

        ResponseEntity<Void> response = restTemplate.exchange(
                "/api/users/me/password", HttpMethod.PATCH, entity, Void.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    @Test
    void should_return_422_when_current_password_wrong() {
        UserId userId = registerAndGetUserId(
                "wrong_pass_422@example.com", "70000000007", "SenhaForte123!", "Wrong Pass User");

        ChangePasswordRequest request = new ChangePasswordRequest("SenhaErrada!", "NovaSenha456!");
        HttpEntity<ChangePasswordRequest> entity = new HttpEntity<>(request, bearerHeaders(userId));

        ResponseEntity<ErrorResponse> response = restTemplate.exchange(
                "/api/users/me/password", HttpMethod.PATCH, entity, ErrorResponse.class);

        assertThat(response.getStatusCode().value()).isEqualTo(422);
    }

    // -------------------------------------------------------------------------
    // PATCH /api/users/me/deactivate (protected)
    // -------------------------------------------------------------------------

    @Test
    void should_deactivate_user_and_return_204() {
        UserId userId = registerAndGetUserId(
                "deactivate_204@example.com", "80000000008", "SenhaForte123!", "Deactivate User");

        HttpEntity<Void> entity = new HttpEntity<>(bearerHeaders(userId));

        ResponseEntity<Void> response = restTemplate.exchange(
                "/api/users/me/deactivate", HttpMethod.PATCH, entity, Void.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }
}
