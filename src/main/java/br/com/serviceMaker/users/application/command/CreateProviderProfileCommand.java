package br.com.serviceMaker.users.application.command;

import br.com.serviceMaker.shared.UserId;

public record CreateProviderProfileCommand(UserId userId,
                                           String description) {
}
