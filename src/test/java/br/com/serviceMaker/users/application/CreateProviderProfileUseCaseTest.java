package br.com.serviceMaker.users.application;


import br.com.serviceMaker.shared.UserId;
import br.com.serviceMaker.users.application.command.CreateProviderProfileCommand;
import br.com.serviceMaker.users.domain.ProviderProfileCreatedEvent;
import br.com.serviceMaker.users.domain.User;
import br.com.serviceMaker.users.domain.UserRepository;
import br.com.serviceMaker.users.domain.UserRole;
import br.com.serviceMaker.users.domain.exceptions.UserNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.mockito.ArgumentCaptor;

@ExtendWith(MockitoExtension.class)
class CreateProviderProfileUseCaseTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    private CreateProviderProfileUseCase useCase;

    @BeforeEach
    void setUp() {
        useCase = new CreateProviderProfileUseCase(userRepository, eventPublisher);
    }

    @Test
    void should_create_provider_profile_successfully() {
        User user = User.registerUser("user@email.com", "12345678900", "hash", "Julio");
        var command = new CreateProviderProfileCommand(user.getId(), "Eletricista");

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        useCase.execute(command);

        verify(userRepository).save(argThat(u ->
                u.hasProviderProfile() && u.hasRole(UserRole.PROVIDER)
        ));
    }

    @Test
    void should_throw_when_user_not_found() {
        UserId unknownId = UserId.generate();
        var command = new CreateProviderProfileCommand(unknownId, "Eletricista");

        when(userRepository.findById(unknownId)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> useCase.execute(command));
        verify(userRepository, never()).save(any());
    }

    @Test
    void should_propagate_domain_exception_when_profile_already_exists() {
        User user = User.registerUser("user@email.com", "12345678900", "hash", "Julio");
        user.createProviderProfile("Eletricista");
        var command = new CreateProviderProfileCommand(user.getId(), "Outro servico");

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        assertThrows(IllegalStateException.class, () -> useCase.execute(command));
        verify(userRepository, never()).save(any());
    }

    @Test
    void should_publish_ProviderProfileCreatedEvent_after_profile_creation() {
        User user = User.registerUser("user@email.com", "12345678900", "hash", "Julio");
        var command = new CreateProviderProfileCommand(user.getId(), "Eletricista");

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        useCase.execute(command);

        var captor = ArgumentCaptor.forClass(Object.class);
        verify(eventPublisher).publishEvent(captor.capture());
        assertThat(captor.getValue()).isInstanceOf(ProviderProfileCreatedEvent.class);
        var event = (ProviderProfileCreatedEvent) captor.getValue();
        assertThat(event.userId()).isEqualTo(user.getId().value());
        assertThat(event.description()).isEqualTo("Eletricista");
    }
}