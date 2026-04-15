package br.com.serviceMaker.users.application.command;

public record RegisterUserCommand(
        String email,
        String cpf,
        String rawPassword,
        String name
) {}
