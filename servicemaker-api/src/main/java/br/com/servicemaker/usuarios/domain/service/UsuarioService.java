package br.com.servicemaker.usuarios.domain.service;

import br.com.servicemaker.usuarios.api.UsuarioFacade;
import br.com.servicemaker.usuarios.api.dto.UsuarioAuthDto;
import br.com.servicemaker.usuarios.domain.port_out.PasswordPort;
import br.com.servicemaker.usuarios.domain.port_out.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UsuarioService implements UsuarioFacade {

    private final UsuarioRepository usuarioRepository;
    private final PasswordPort passwordPort;


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
