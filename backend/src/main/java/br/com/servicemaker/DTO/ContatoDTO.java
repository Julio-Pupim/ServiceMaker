package br.com.servicemaker.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ContatoDTO(String telefone, String celular, @Email @NotBlank @NotNull String email) {

}
