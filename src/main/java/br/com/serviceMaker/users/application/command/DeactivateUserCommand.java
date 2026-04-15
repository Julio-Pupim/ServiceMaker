package br.com.serviceMaker.users.application.command;

import br.com.serviceMaker.shared.UserId;

public record DeactivateUserCommand(UserId userId) {
}
