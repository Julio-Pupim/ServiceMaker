package br.com.serviceMaker.users.application;

import br.com.serviceMaker.users.application.command.CreateProviderProfileCommand;
import br.com.serviceMaker.users.domain.ProviderProfileCreatedEvent;
import br.com.serviceMaker.users.domain.User;
import br.com.serviceMaker.users.domain.UserRepository;
import br.com.serviceMaker.users.domain.exceptions.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class CreateProviderProfileUseCase {
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public void execute(CreateProviderProfileCommand command) {

        User user = userRepository.findById(command.userId())
                .orElseThrow(() -> new UserNotFoundException(command.userId()));

        user.createProviderProfile(command.description());

        userRepository.save(user);

        eventPublisher.publishEvent(new ProviderProfileCreatedEvent(
                user.getId().value(),
                command.description(),
                Instant.now()
        ));
    }
}
