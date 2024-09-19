package br.com.servicemaker.repository;

import br.com.servicemaker.AbstractCrud.AbstractRepository;
import br.com.servicemaker.domain.Usuario;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends AbstractRepository<Usuario> {

}
