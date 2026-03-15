package br.com.serviceMaker.users.domain;

import org.junit.jupiter.api.Test;

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
}