package br.com.serviceMaker.users.application;

import br.com.serviceMaker.users.application.command.ChangePasswordCommand;
import br.com.serviceMaker.users.domain.PasswordHasher;
import br.com.serviceMaker.users.domain.User;
import br.com.serviceMaker.users.domain.UserRepository;
import br.com.serviceMaker.users.domain.exceptions.InvalidPasswordException;
import br.com.serviceMaker.users.domain.exceptions.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChangePasswordUseCase {
    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;

    public void execute(ChangePasswordCommand command) {

        User user = userRepository.findById(command.userId())
                .orElseThrow(() -> new UserNotFoundException(command.userId()));

        if (!passwordHasher.matches(command.currentPassword(), user.getPasswordHash().getValue())) {
            throw new InvalidPasswordException();
        }

        user.changePassword(passwordHasher.hash(command.newPassword()));

        userRepository.save(user);
    }
}
