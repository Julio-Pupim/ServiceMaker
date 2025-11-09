package br.com.servicemaker.auth.adapter.out.usuario;

import br.com.servicemaker.auth.domain.port_out.UsuarioPort;
import br.com.servicemaker.usuarioapi.api.UsuarioFacade;
import br.com.servicemaker.usuarioapi.api.dto.UsuarioAuthDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UsuarioAdapterMonolith implements UsuarioPort {

    private final UsuarioFacade usuarioFacade;

    @Override
    public Optional<UsuarioAuthDto> findByEmail(String email) {
        return usuarioFacade.findAuthInfoByEmail(email);
    }

    @Override
    public Optional<UsuarioAuthDto> findById(UUID id) {
        return usuarioFacade.findAuthInfoById(id);
    }
}