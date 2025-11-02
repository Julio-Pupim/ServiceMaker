package br.com.servicemaker.auth.domain.port_out;

import br.com.servicemaker.auth.domain.model.AccessToken;
import br.com.servicemaker.usuarios.api.dto.UsuarioAuthDto;

public interface TokenPort {
    AccessToken createAccessToken(UsuarioAuthDto user);
    String hash(String plain);
}
