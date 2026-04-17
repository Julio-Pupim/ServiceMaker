package br.com.serviceMaker.users.api;

import jakarta.validation.constraints.NotBlank;

public record RegisterUserRequest(
        @NotBlank String email,
        @NotBlank String cpf,
        @NotBlank String password,
        @NotBlank String name
) {}
