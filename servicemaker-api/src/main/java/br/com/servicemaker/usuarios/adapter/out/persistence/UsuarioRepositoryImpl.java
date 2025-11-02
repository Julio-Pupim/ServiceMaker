package br.com.servicemaker.usuarios.adapter.out.persistence;

import br.com.servicemaker.usuarios.adapter.out.mapper.UsuarioMapper;
import br.com.servicemaker.usuarios.domain.model.Usuario;
import br.com.servicemaker.usuarios.domain.port_out.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

import static br.com.servicemaker.usuarios.adapter.out.mapper.UsuarioMapper.toEntity;


@Component
@Transactional
@AllArgsConstructor
public class UsuarioRepositoryImpl implements UsuarioRepository {

    private final JpaUsuarioRepositoryImpl jpa;

    @Override
    public void save(Usuario usuario) {
        jpa.save(toEntity(usuario));
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        jpa.findByEmail(email).map(UsuarioMapper::toDomain);
        return Optional.empty();
    }

}
