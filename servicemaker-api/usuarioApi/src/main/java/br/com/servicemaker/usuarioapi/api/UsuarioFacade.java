package br.com.servicemaker.usuarioapi.api;

import br.com.servicemaker.usuarioapi.api.dto.UsuarioAuthDto;
import br.com.servicemaker.usuarioapi.api.dto.UsuarioRequest;

import java.util.Optional;
import java.util.UUID;

public interface UsuarioFacade {
    Optional<UsuarioAuthDto> findAuthInfoByEmail(String email);
    Optional<UsuarioAuthDto> findAuthInfoById(UUID id);

    void registrarUsuario(UsuarioRequest newUsuario);
}
