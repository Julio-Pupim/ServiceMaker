package br.com.serviceMaker.users.application;

import br.com.serviceMaker.shared.Email;
import br.com.serviceMaker.users.api.LoginResponse;
import br.com.serviceMaker.users.application.command.LoginCommand;
import br.com.serviceMaker.users.domain.PasswordHasher;
import br.com.serviceMaker.users.domain.User;
import br.com.serviceMaker.users.domain.UserRepository;
import br.com.serviceMaker.users.domain.exceptions.InactiveUserException;
import br.com.serviceMaker.users.domain.exceptions.InvalidCredentialsException;
import br.com.serviceMaker.users.infra.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticateUserUseCase {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;
    private final JwtService jwtService;

    public LoginResponse execute(LoginCommand command) {
        User user = userRepository.findByEmail(Email.of(command.email()))
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordHasher.matches(command.rawPassword(), user.getPasswordHash().getValue())) {
            throw new InvalidCredentialsException();
        }

        if (!user.isActive()) {
            throw new InactiveUserException("Cannot login: user is inactive");
        }

        String token = jwtService.generateToken(user.getId());
        return new LoginResponse(token, jwtService.getExpirationSeconds());
    }
}
