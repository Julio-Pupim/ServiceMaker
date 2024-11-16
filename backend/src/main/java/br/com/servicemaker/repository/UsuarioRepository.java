package br.com.servicemaker.repository;

import br.com.servicemaker.DTO.UserDetailsDTO;
import br.com.servicemaker.abstractcrud.AbstractRepository;
import br.com.servicemaker.domain.Usuario;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends AbstractRepository<Usuario> {

  @Query(
      "SELECT NEW  br.com.servicemaker.DTO.UserDetailsDTO(u.senha, c.email, u.role, u.nome) FROM Usuario u "
          + " INNER JOIN u.contato c"
          + " WHERE c.email = :email")
  UserDetailsDTO findByContatoEmail(String email);

/*
 @Query(
      "SELECT NEW  br.com.servicemaker.DTO.UserDetailsDTO(u.senha, u.contato.email, u.role) FROM Usuario u "
          + "WHERE u.contato.email = :email")
  UserDetailsDTO findByContatoEmail(String email);

 */
}
