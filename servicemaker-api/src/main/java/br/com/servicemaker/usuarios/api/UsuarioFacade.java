package br.com.servicemaker.usuarios.api;

import br.com.servicemaker.usuarios.api.dto.UsuarioAuthDto;

import java.util.Optional;
import java.util.UUID;

public interface UsuarioFacade {
    Optional<UsuarioAuthDto> findAuthInfoByEmail(String email);
    Optional<UsuarioAuthDto> findAuthInfoById(UUID id);
}
