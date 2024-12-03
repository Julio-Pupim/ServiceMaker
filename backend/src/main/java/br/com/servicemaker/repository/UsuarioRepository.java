package br.com.servicemaker.repository;

import br.com.servicemaker.abstractcrud.AbstractRepository;
import br.com.servicemaker.domain.Usuario;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends AbstractRepository<Usuario> {

  UserDetails findByContatoEmail(String email);
}
