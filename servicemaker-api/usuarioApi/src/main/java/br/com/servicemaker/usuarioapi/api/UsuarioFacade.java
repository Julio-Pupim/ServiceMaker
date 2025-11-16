package br.com.servicemaker.usuarioapi.api;

import br.com.servicemaker.usuarioapi.api.dto.UsuarioAuthDto;
import br.com.servicemaker.usuarioapi.api.dto.UsuarioRequest;
import br.com.servicemaker.usuarioapi.api.dto.UsuarioResponseDto;
import br.com.servicemaker.usuarioapi.api.dto.UsuarioUpdateDto;

import java.util.Optional;
import java.util.UUID;

public interface UsuarioFacade {
    Optional<UsuarioAuthDto> findAuthInfoByEmail(String email);
    Optional<UsuarioAuthDto> findAuthInfoById(UUID id);

    void registrarUsuario(UsuarioRequest newUsuario);

    UsuarioResponseDto findProfileByEmail(String email);

    UsuarioResponseDto updateProfile(String email, UsuarioUpdateDto updateDto);
}
