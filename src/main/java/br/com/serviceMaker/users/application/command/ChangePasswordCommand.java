package br.com.serviceMaker.users.application.command;

import br.com.serviceMaker.shared.UserId;

public record ChangePasswordCommand(
        UserId userId,
        String currentPassword,
        String newPassword
) {
}
