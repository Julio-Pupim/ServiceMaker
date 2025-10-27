package br.com.servicemaker.usuarios.api.dto;

import java.util.List;
import java.util.UUID;

public record UsuarioAuthDto(
        UUID id,
        String email,
        String passwordHash,
        List<String> roles) { }

