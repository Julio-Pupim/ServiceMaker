package br.com.servicemaker.usuarios.domain.port_out;

import br.com.servicemaker.usuarios.domain.model.Usuario;

import java.util.Optional;

public interface UsuarioRepository {

    void save(Usuario usuario);

    Optional<Usuario> findByEmail(String email);
}
