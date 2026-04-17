package br.com.serviceMaker.users.api;

import jakarta.validation.constraints.NotBlank;

public record CreateProviderProfileRequest(
        @NotBlank String description
) {}
