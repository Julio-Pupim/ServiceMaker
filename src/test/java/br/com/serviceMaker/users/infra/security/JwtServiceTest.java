package br.com.serviceMaker.users.infra.security;

import br.com.serviceMaker.shared.UserId;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private static final String TEST_SECRET = "test-secret-key-that-is-at-least-256-bits-long-for-hmac-sha-256";
    private static final long EXPIRATION_SECONDS = 3600;

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(TEST_SECRET, EXPIRATION_SECONDS);
    }

    @Test
    void should_generate_valid_token_for_user_id() {
        UserId userId = UserId.generate();

        String token = jwtService.generateToken(userId);

        assertThat(token).isNotNull().isNotBlank();
    }

    @Test
    void should_extract_user_id_from_valid_token() {
        UserId userId = UserId.generate();

        String token = jwtService.generateToken(userId);
        UserId extracted = jwtService.extractUserId(token);

        assertThat(extracted).isEqualTo(userId);
    }

    @Test
    void should_reject_expired_token() {
        JwtService expiredJwtService = new JwtService(TEST_SECRET, -1);
        UserId userId = UserId.generate();
        String token = expiredJwtService.generateToken(userId);

        assertThatThrownBy(() -> jwtService.extractUserId(token))
                .isInstanceOf(ExpiredJwtException.class);
    }

    @Test
    void should_reject_malformed_token() {
        assertThatThrownBy(() -> jwtService.extractUserId("this.is.not.a.valid.jwt.token"))
                .isInstanceOf(Exception.class);
    }
}
