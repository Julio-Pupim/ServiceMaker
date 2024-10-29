package br.com.servicemaker.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ContatoDTO(@NotBlank @NotNull String telefone,
                         @Email @NotBlank @NotNull String email) {

}
