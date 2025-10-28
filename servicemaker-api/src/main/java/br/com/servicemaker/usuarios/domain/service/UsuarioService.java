package br.com.servicemaker.usuarios.domain.service;

import br.com.servicemaker.usuarios.api.UsuarioFacade;
import br.com.servicemaker.usuarios.api.dto.UsuarioAuthDto;

import java.util.Optional;
import java.util.UUID;

public class UsuarioService implements UsuarioFacade {

    @Override
    public Optional<UsuarioAuthDto> findAuthInfoByEmail(String email) {
        return Optional.empty();
    }

    @Override
    public Optional<UsuarioAuthDto> findAuthInfoById(UUID id) {
        return Optional.empty();
    }

    @Override
    public void registrarUsuario() {

    }
}
