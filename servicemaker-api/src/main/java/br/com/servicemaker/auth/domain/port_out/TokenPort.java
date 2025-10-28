package br.com.servicemaker.auth.domain.port_out;

import br.com.servicemaker.usuarios.api.dto.UsuarioAuthDto;

public interface TokenPort {
    record AccessToken(
            String value,
            long expiresInSeconds
    ) {}
    AccessToken createAccessToken(UsuarioAuthDto user);
    String hash(String plain);
}
