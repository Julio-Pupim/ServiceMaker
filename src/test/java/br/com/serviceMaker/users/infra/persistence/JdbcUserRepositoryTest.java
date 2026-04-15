package br.com.serviceMaker.users.infra.persistence;

import br.com.serviceMaker.shared.Cpf;
import br.com.serviceMaker.shared.Email;
import br.com.serviceMaker.shared.UserId;
import br.com.serviceMaker.users.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers
class JdbcUserRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17-alpine");

    @Autowired
    private JdbcUserRepository repository;

    @Test
    void should_save_and_find_user_by_id() {
        User user = User.registerUser(
                "joao@example.com",
                "12345678901",
                "$2a$10$hashedpassword1",
                "Joao Silva"
        );

        repository.save(user);

        Optional<User> found = repository.findById(user.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getId()).isEqualTo(user.getId());
        assertThat(found.get().getEmail()).isEqualTo(user.getEmail());
        assertThat(found.get().getCpf()).isEqualTo(user.getCpf());
        assertThat(found.get().getName()).isEqualTo(user.getName());
        assertThat(found.get().isActive()).isTrue();
        assertThat(found.get().hasClientProfile()).isTrue();
        assertThat(found.get().hasProviderProfile()).isFalse();
    }

    @Test
    void should_find_user_by_email() {
        User user = User.registerUser(
                "maria@example.com",
                "98765432100",
                "$2a$10$hashedpassword2",
                "Maria Oliveira"
        );

        repository.save(user);

        Optional<User> found = repository.findByEmail(Email.of("maria@example.com"));

        assertThat(found).isPresent();
        assertThat(found.get().getId()).isEqualTo(user.getId());
        assertThat(found.get().getEmail().getValue()).isEqualTo("maria@example.com");
    }

    @Test
    void should_find_user_by_cpf() {
        User user = User.registerUser(
                "pedro@example.com",
                "11122233344",
                "$2a$10$hashedpassword3",
                "Pedro Santos"
        );

        repository.save(user);

        Optional<User> found = repository.findByCpf(Cpf.of("11122233344"));

        assertThat(found).isPresent();
        assertThat(found.get().getId()).isEqualTo(user.getId());
        assertThat(found.get().getCpf().getValue()).isEqualTo("11122233344");
    }

    @Test
    void should_return_empty_when_not_found() {
        UserId nonExistentId = UserId.generate();

        Optional<User> found = repository.findById(nonExistentId);

        assertThat(found).isEmpty();
    }

    @Test
    void should_save_user_with_provider_profile() {
        User user = User.registerUser(
                "ana@example.com",
                "55566677788",
                "$2a$10$hashedpassword4",
                "Ana Costa"
        );
        user.createProviderProfile("Experienced plumber with 10 years of experience");

        repository.save(user);

        Optional<User> found = repository.findById(user.getId());

        assertThat(found).isPresent();
        assertThat(found.get().hasProviderProfile()).isTrue();
        assertThat(found.get().hasClientProfile()).isTrue();
        assertThat(found.get().getProviderProfile().getDescription())
                .isEqualTo("Experienced plumber with 10 years of experience");
        assertThat(found.get().getRoles()).containsExactlyInAnyOrder(
                br.com.serviceMaker.users.domain.UserRole.CLIENT,
                br.com.serviceMaker.users.domain.UserRole.PROVIDER
        );
    }

    @Test
    void should_update_existing_user() {
        User user = User.registerUser(
                "carlos@example.com",
                "99988877766",
                "$2a$10$hashedpassword5",
                "Carlos Ferreira"
        );

        repository.save(user);

        user.deactivate();
        repository.save(user);

        Optional<User> found = repository.findById(user.getId());

        assertThat(found).isPresent();
        assertThat(found.get().isActive()).isFalse();
    }
}
