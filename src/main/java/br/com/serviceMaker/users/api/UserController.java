package br.com.serviceMaker.users.api;

import br.com.serviceMaker.shared.UserId;
import br.com.serviceMaker.users.application.ChangePasswordUseCase;
import br.com.serviceMaker.users.application.CreateProviderProfileUseCase;
import br.com.serviceMaker.users.application.DeactivateUserUseCase;
import br.com.serviceMaker.users.application.RegisterUserUseCase;
import br.com.serviceMaker.users.application.command.ChangePasswordCommand;
import br.com.serviceMaker.users.application.command.CreateProviderProfileCommand;
import br.com.serviceMaker.users.application.command.DeactivateUserCommand;
import br.com.serviceMaker.users.application.command.RegisterUserCommand;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final RegisterUserUseCase registerUserUseCase;
    private final CreateProviderProfileUseCase createProviderProfileUseCase;
    private final ChangePasswordUseCase changePasswordUseCase;
    private final DeactivateUserUseCase deactivateUserUseCase;

    @PostMapping
    public ResponseEntity<UserIdResponse> registerUser(@Valid @RequestBody RegisterUserRequest request) {
        UserId userId = registerUserUseCase.execute(new RegisterUserCommand(
                request.email(),
                request.cpf(),
                request.password(),
                request.name()
        ));
        return ResponseEntity.status(HttpStatus.CREATED).body(new UserIdResponse(userId.value()));
    }

    @PostMapping("/me/provider-profile")
    public ResponseEntity<Void> createProviderProfile(
            @Valid @RequestBody CreateProviderProfileRequest request,
            @AuthenticationPrincipal UserId userId) {
        createProviderProfileUseCase.execute(new CreateProviderProfileCommand(userId, request.description()));
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PatchMapping("/me/password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal UserId userId) {
        changePasswordUseCase.execute(new ChangePasswordCommand(userId, request.currentPassword(), request.newPassword()));
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/me/deactivate")
    public ResponseEntity<Void> deactivateUser(@AuthenticationPrincipal UserId userId) {
        deactivateUserUseCase.execute(new DeactivateUserCommand(userId));
        return ResponseEntity.noContent().build();
    }
}
