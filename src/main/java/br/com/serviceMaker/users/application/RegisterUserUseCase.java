package br.com.serviceMaker.users.application;

import br.com.serviceMaker.shared.Cpf;
import br.com.serviceMaker.shared.Email;
import br.com.serviceMaker.shared.UserId;
import br.com.serviceMaker.users.application.command.RegisterUserCommand;
import br.com.serviceMaker.users.domain.PasswordHasher;
import br.com.serviceMaker.users.domain.User;
import br.com.serviceMaker.users.domain.UserRepository;
import br.com.serviceMaker.users.domain.exceptions.CpfAlreadyExistsException;
import br.com.serviceMaker.users.domain.exceptions.EmailAlreadyExistsException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class RegisterUserUseCase {
    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;
    public UserId execute(RegisterUserCommand command) {
        userRepository.findByEmail(Email.of(command.email()))
                .ifPresent(u -> { throw new EmailAlreadyExistsException(command.email()); });

        userRepository.findByCpf(Cpf.of(command.cpf()))
                .ifPresent(u -> { throw new CpfAlreadyExistsException(command.cpf()); });

        String hashedPassword = passwordHasher.hash(command.rawPassword());

        User user = User.registerUser(
                command.email(),
                command.cpf(),
                hashedPassword,
                command.name()
        );

        return userRepository.save(user).getId();
    }

}
