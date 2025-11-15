package br.com.servicemaker.usuarioapi.api.dto;

import java.util.List;
import java.util.UUID;

public record UsuarioAuthDto(
        UUID id,
        String email,
        String senhaHash,
        List<String> roles) { }

