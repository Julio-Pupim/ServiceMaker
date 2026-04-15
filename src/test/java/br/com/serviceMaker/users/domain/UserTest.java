package br.com.serviceMaker.users.domain;

import br.com.serviceMaker.shared.Cpf;
import br.com.serviceMaker.shared.Email;
import br.com.serviceMaker.shared.UserId;
import br.com.serviceMaker.shared.UserName;
import br.com.serviceMaker.users.domain.exceptions.InactiveUserException;
import br.com.serviceMaker.users.domain.vo.PasswordHash;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {
    @Test
    void should_register_user_with_client_role() {

        User user = User.registerUser(
                "user@email.com",
                "12345678900",
                "hash",
                "Julio"
        );

        assertNotNull(user);
        assertTrue(user.isActive());
        assertTrue(user.getRoles().contains(UserRole.CLIENT));
    }
    @Test
    void should_create_provider_profile() {

        User user = User.registerUser(
                "user@email.com",
                "12345678900",
                "hash",
                "Julio"
        );

        user.createProviderProfile("Eletricista");

        assertNotNull(user.getProviderProfile());
        assertTrue(user.getRoles().contains(UserRole.PROVIDER));

    }
    @Test
    void should_not_allow_two_provider_profiles() {

        User user = User.registerUser(
                "user@email.com",
                "12345678900",
                "hash",
                "Julio"
        );

        user.createProviderProfile("Eletricista");

        assertThrows(
                IllegalStateException.class,
                () -> user.createProviderProfile("Outro")
        );
    }
    @Test
    void should_deactivate_user() {

        User user = User.registerUser(
                "user@email.com",
                "12345678900",
                "hash",
                "Julio"
        );

        user.deactivate();

        assertFalse(user.isActive());
    }
    @Test
    void should_not_allow_empty_password() {

        User user = User.registerUser(
                "user@email.com",
                "12345678900",
                "hash",
                "Julio"
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> user.changePassword("")
        );
    }
    @Test
    void should_not_allow_register_with_empty_email() {

        assertThrows(
                IllegalArgumentException.class,
                () -> User.registerUser(
                        "",
                        "12345678900",
                        "hash",
                        "Julio"
                )
        );
    }
    @Test
    void should_create_client_profile_on_registration() {

        User user = User.registerUser(
                "user@email.com",
                "12345678900",
                "hash",
                "Julio"
        );

        assertNotNull(user.getClientProfile());
        assertTrue(user.getRoles().contains(UserRole.CLIENT));
    }

    @Test
    void should_not_allow_inactive_user_to_create_provider_profile() {

        User user = User.registerUser(
                "user@email.com",
                "12345678900",
                "hash",
                "Julio"
        );

        user.deactivate();

        assertThrows(
                InactiveUserException.class,
                () -> user.createProviderProfile("Eletricista")
        );
    }

    @Test
    void should_not_allow_inactive_user_to_change_password() {

        User user = User.registerUser(
                "user@email.com",
                "12345678900",
                "hash",
                "Julio"
        );

        user.deactivate();

        assertThrows(
                InactiveUserException.class,
                () -> user.changePassword("newHash")
        );
    }

    @Test
    void should_allow_deactivation_on_inactive_user_idempotently() {

        User user = User.registerUser(
                "user@email.com",
                "12345678900",
                "hash",
                "Julio"
        );

        user.deactivate();
        assertDoesNotThrow(user::deactivate);
        assertFalse(user.isActive());
    }

    @Test
    void should_reconstitute_user_from_persistence_data() {

        UserId id = UserId.generate();
        Email email = Email.of("reconstituted@email.com");
        Cpf cpf = Cpf.of("12345678900");
        PasswordHash passwordHash = PasswordHash.of("storedHash");
        UserName name = UserName.of("Maria");
        Instant createdAt = Instant.parse("2024-01-15T10:00:00Z");
        boolean active = false;
        Set<UserRole> roles = Set.of(UserRole.CLIENT);
        ClientProfile clientProfile = ClientProfile.reconstitute(id, createdAt);

        User user = User.reconstitute(id, email, cpf, passwordHash, name, createdAt, active, roles, clientProfile, null);

        assertEquals(id, user.getId());
        assertEquals(email, user.getEmail());
        assertEquals(cpf, user.getCpf());
        assertEquals(passwordHash, user.getPasswordHash());
        assertEquals(name, user.getName());
        assertEquals(createdAt, user.getCreatedAt());
        assertFalse(user.isActive());
        assertTrue(user.getRoles().contains(UserRole.CLIENT));
        assertEquals(1, user.getRoles().size());
        assertNotNull(user.getClientProfile());
        assertNull(user.getProviderProfile());
    }

    @Test
    void should_reconstitute_user_with_provider_profile() {

        UserId id = UserId.generate();
        Email email = Email.of("provider@email.com");
        Cpf cpf = Cpf.of("12345678900");
        PasswordHash passwordHash = PasswordHash.of("hashedPwd");
        UserName name = UserName.of("Carlos");
        Instant createdAt = Instant.parse("2024-03-10T08:30:00Z");
        boolean active = true;
        Set<UserRole> roles = Set.of(UserRole.CLIENT, UserRole.PROVIDER);
        ClientProfile clientProfile = ClientProfile.reconstitute(id, createdAt);
        ProviderProfile providerProfile = ProviderProfile.reconstitute(
                id,
                "Eletricista experiente",
                new BigDecimal("4.5"),
                10L,
                createdAt
        );

        User user = User.reconstitute(id, email, cpf, passwordHash, name, createdAt, active, roles, clientProfile, providerProfile);

        assertTrue(user.isActive());
        assertTrue(user.getRoles().contains(UserRole.CLIENT));
        assertTrue(user.getRoles().contains(UserRole.PROVIDER));
        assertEquals(2, user.getRoles().size());
        assertNotNull(user.getProviderProfile());
        assertEquals("Eletricista experiente", user.getProviderProfile().description);
        assertEquals(new BigDecimal("4.5"), user.getProviderProfile().rating);
        assertEquals(10L, user.getProviderProfile().reviewCount);
    }
}