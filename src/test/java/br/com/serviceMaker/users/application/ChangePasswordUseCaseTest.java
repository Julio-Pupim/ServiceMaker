package br.com.serviceMaker.users.application;


import br.com.serviceMaker.shared.UserId;
import br.com.serviceMaker.users.application.command.ChangePasswordCommand;
import br.com.serviceMaker.users.domain.PasswordHasher;
import br.com.serviceMaker.users.domain.User;
import br.com.serviceMaker.users.domain.UserRepository;
import br.com.serviceMaker.users.domain.exceptions.InvalidPasswordException;
import br.com.serviceMaker.users.domain.exceptions.UserNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChangePasswordUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordHasher passwordHasher;

    private ChangePasswordUseCase useCase;

    @BeforeEach
    void setUp() {
        useCase = new ChangePasswordUseCase(userRepository, passwordHasher);
    }

    @Test
    void should_change_password_when_current_is_correct() {
        User user = User.registerUser("user@email.com", "12345678900", "old_hash", "Julio");
        var command = new ChangePasswordCommand(user.getId(), "oldRaw", "newRaw");

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(passwordHasher.matches("oldRaw", "old_hash")).thenReturn(true);
        when(passwordHasher.hash("newRaw")).thenReturn("new_hash");
        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        useCase.execute(command);

        verify(userRepository).save(argThat(u ->
                u.getPasswordHash().getValue().equals("new_hash")
        ));
    }

    @Test
    void should_throw_when_user_not_found() {
        UserId unknownId = UserId.generate();
        var command = new ChangePasswordCommand(unknownId, "old", "new");

        when(userRepository.findById(unknownId)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> useCase.execute(command));
        verify(userRepository, never()).save(any());
    }

    @Test
    void should_throw_when_current_password_is_wrong() {
        User user = User.registerUser("user@email.com", "12345678900", "old_hash", "Julio");
        var command = new ChangePasswordCommand(user.getId(), "wrongPassword", "newRaw");

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(passwordHasher.matches("wrongPassword", "old_hash")).thenReturn(false);

        assertThrows(InvalidPasswordException.class, () -> useCase.execute(command));
        verify(userRepository, never()).save(any());
    }

    @Test
    void should_not_hash_new_password_when_current_is_wrong() {
        User user = User.registerUser("user@email.com", "12345678900", "old_hash", "Julio");
        var command = new ChangePasswordCommand(user.getId(), "wrong", "newRaw");

        when(userRepository.findById(any())).thenReturn(Optional.of(user));
        when(passwordHasher.matches(any(), any())).thenReturn(false);

        assertThrows(InvalidPasswordException.class, () -> useCase.execute(command));
        verify(passwordHasher, never()).hash(any());
        verify(userRepository, never()).save(any());
    }
}
