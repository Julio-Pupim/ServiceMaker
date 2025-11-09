package br.com.servicemaker.auth.domain.port_out;

import br.com.servicemaker.usuarioapi.api.dto.UsuarioAuthDto;

import java.util.Optional;
import java.util.UUID;

public interface UsuarioPort {
    Optional<UsuarioAuthDto> findByEmail(String email);
    Optional<UsuarioAuthDto> findById(UUID id);
}
