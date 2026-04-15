package br.com.serviceMaker.users.application;

import br.com.serviceMaker.users.application.command.CreateProviderProfileCommand;
import br.com.serviceMaker.users.domain.User;
import br.com.serviceMaker.users.domain.UserRepository;
import br.com.serviceMaker.users.domain.exceptions.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateProviderProfileUseCase {
    private final UserRepository userRepository;

    public void execute(CreateProviderProfileCommand command) {

        User user = userRepository.findById(command.userId())
                .orElseThrow(() -> new UserNotFoundException(command.userId()));

        user.createProviderProfile(command.description());

        userRepository.save(user);
    }
}
