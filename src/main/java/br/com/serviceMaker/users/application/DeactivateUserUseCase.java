package br.com.serviceMaker.users.application;

import br.com.serviceMaker.users.application.command.DeactivateUserCommand;
import br.com.serviceMaker.users.domain.User;
import br.com.serviceMaker.users.domain.UserDeactivatedEvent;
import br.com.serviceMaker.users.domain.UserRepository;
import br.com.serviceMaker.users.domain.exceptions.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class DeactivateUserUseCase {
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public void execute(DeactivateUserCommand command){
        User user = userRepository.findById(command.userId())
                .orElseThrow(() -> new UserNotFoundException(command.userId()));

        boolean wasActive = user.isActive();

        user.deactivate();

        userRepository.save(user);

        if (wasActive) {
            eventPublisher.publishEvent(new UserDeactivatedEvent(
                    user.getId().value(),
                    Instant.now()
            ));
        }
    }
}
