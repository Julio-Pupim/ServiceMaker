package br.com.serviceMaker.users.application;

import br.com.serviceMaker.shared.Cpf;
import br.com.serviceMaker.shared.Email;
import br.com.serviceMaker.shared.UserId;
import br.com.serviceMaker.users.application.command.RegisterUserCommand;
import br.com.serviceMaker.users.domain.PasswordHasher;
import br.com.serviceMaker.users.domain.User;
import br.com.serviceMaker.users.domain.UserRegisteredEvent;
import br.com.serviceMaker.users.domain.UserRepository;
import br.com.serviceMaker.users.domain.exceptions.CpfAlreadyExistsException;
import br.com.serviceMaker.users.domain.exceptions.EmailAlreadyExistsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

import org.mockito.ArgumentCaptor;

@ExtendWith(MockitoExtension.class)
class RegisterUserUseCaseTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordHasher passwordHasher;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    private RegisterUserUseCase useCase;

    @BeforeEach
    void setUp() {
        useCase = new RegisterUserUseCase(userRepository, passwordHasher, eventPublisher);
    }
    @Test
    void should_register_user_and_return_id() {
        var command = new RegisterUserCommand("user@email.com", "12345678900", "senha123", "Julio");

        when(userRepository.findByEmail(Email.of("user@email.com"))).thenReturn(Optional.empty());
        when(userRepository.findByCpf(Cpf.of("12345678900"))).thenReturn(Optional.empty());
        when(passwordHasher.hash("senha123")).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        UserId result = useCase.execute(command);

        assertNotNull(result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void should_hash_password_before_saving() {
        var command = new RegisterUserCommand("user@email.com", "12345678900", "rawPassword", "Julio");

        when(userRepository.findByEmail(any())).thenReturn(Optional.empty());
        when(userRepository.findByCpf(any())).thenReturn(Optional.empty());
        when(passwordHasher.hash("rawPassword")).thenReturn("bcrypt_hash");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        useCase.execute(command);

        verify(userRepository).save(argThat(user ->
                user.getPasswordHash().getValue().equals("bcrypt_hash")
        ));
    }

    @Test
    void should_throw_when_email_already_registered() {
        var command = new RegisterUserCommand("user@email.com", "12345678900", "senha123", "Julio");
        var existing = User.registerUser("user@email.com", "99988877766", "hash", "Outro");

        when(userRepository.findByEmail(Email.of("user@email.com"))).thenReturn(Optional.of(existing));

        assertThrows(EmailAlreadyExistsException.class, () -> useCase.execute(command));
        verify(userRepository, never()).save(any());
    }

    @Test
    void should_throw_when_cpf_already_registered() {
        var command = new RegisterUserCommand("user@email.com", "12345678900", "senha123", "Julio");
        var existing = User.registerUser("other@email.com", "12345678900", "hash", "Outro");

        when(userRepository.findByEmail(any())).thenReturn(Optional.empty());
        when(userRepository.findByCpf(Cpf.of("12345678900"))).thenReturn(Optional.of(existing));

        assertThrows(CpfAlreadyExistsException.class, () -> useCase.execute(command));
        verify(userRepository, never()).save(any());
    }

    @Test
    void should_not_hash_password_when_email_is_duplicate() {
        var command = new RegisterUserCommand("user@email.com", "12345678900", "senha123", "Julio");
        var existing = User.registerUser("user@email.com", "99988877766", "hash", "Outro");

        when(userRepository.findByEmail(any())).thenReturn(Optional.of(existing));

        assertThrows(EmailAlreadyExistsException.class, () -> useCase.execute(command));
        verify(passwordHasher, never()).hash(any());
    }

    @Test
    void should_publish_UserRegisteredEvent_after_registration() {
        var command = new RegisterUserCommand("user@email.com", "12345678900", "senha123", "Julio");

        when(userRepository.findByEmail(any())).thenReturn(Optional.empty());
        when(userRepository.findByCpf(any())).thenReturn(Optional.empty());
        when(passwordHasher.hash("senha123")).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        useCase.execute(command);

        var captor = ArgumentCaptor.forClass(Object.class);
        verify(eventPublisher).publishEvent(captor.capture());
        assertThat(captor.getValue()).isInstanceOf(UserRegisteredEvent.class);
        var event = (UserRegisteredEvent) captor.getValue();
        assertThat(event.email()).isEqualTo("user@email.com");
        assertThat(event.name()).isEqualTo("Julio");
    }

}