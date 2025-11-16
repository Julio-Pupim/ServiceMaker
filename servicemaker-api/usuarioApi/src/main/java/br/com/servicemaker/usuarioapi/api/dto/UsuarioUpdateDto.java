package br.com.servicemaker.usuarioapi.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioUpdateDto(
        @NotBlank
        @Size(min = 3, max = 255, message = "O nome deve ter entre 3 e 255 caracteres")
        String nome,
        @Email
        String email
        // No futuro, você pode adicionar mais campos aqui, como 'telefone', etc.
) {
}