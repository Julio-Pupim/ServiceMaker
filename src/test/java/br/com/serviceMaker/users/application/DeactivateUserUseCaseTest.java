package br.com.serviceMaker.users.application;

import br.com.serviceMaker.shared.UserId;
import br.com.serviceMaker.users.application.command.DeactivateUserCommand;
import br.com.serviceMaker.users.domain.User;
import br.com.serviceMaker.users.domain.UserRepository;
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
class DeactivateUserUseCaseTest {

    @Mock
    private UserRepository userRepository;

    private DeactivateUserUseCase useCase;

    @BeforeEach
    void setUp(){
        useCase = new DeactivateUserUseCase(userRepository);
    }

    @Test
    void should_deactivate_active_user(){
        User user = User.registerUser("user@email.com", "12345678900", "hash", "Julio");
        var command = new DeactivateUserCommand(user.getId());
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        useCase.execute(command);

        verify(userRepository).save(argThat(u -> !u.isActive()));

    }
    @Test
    void should_throw_when_user_not_found() {
        UserId unknownId = UserId.generate();
        var command = new DeactivateUserCommand(unknownId);

        when(userRepository.findById(unknownId)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> useCase.execute(command));
        verify(userRepository, never()).save(any());
    }

    @Test
    void should_be_idempotent_when_user_already_inactive() {
        User user = User.registerUser("user@email.com", "12345678900", "hash", "Julio");
        user.deactivate();
        var command = new DeactivateUserCommand(user.getId());

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        useCase.execute(command);

        verify(userRepository).save(argThat(u -> !u.isActive()));
    }
}