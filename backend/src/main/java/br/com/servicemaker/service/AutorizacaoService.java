package br.com.servicemaker.service;


import br.com.servicemaker.DTO.UserDetailsDTO;
import br.com.servicemaker.domain.Contato;
import br.com.servicemaker.domain.Prestador;
import br.com.servicemaker.domain.Usuario;
import br.com.servicemaker.domain.enums.Roles;
import br.com.servicemaker.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AutorizacaoService implements UserDetailsService {

  private final UsuarioRepository repository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    UserDetailsDTO userDetailsDTO = repository.findByContatoEmail(username);

    if (userDetailsDTO.role().equals(Roles.ROLE_PRESTADOR)) {
      Prestador prestador = new Prestador();
      prestador.setSenha(userDetailsDTO.senha());
      Contato contato = new Contato(null, userDetailsDTO.email());
      prestador.setContato(contato);
      prestador.setRole(userDetailsDTO.role());
      prestador.setNome(userDetailsDTO.nome());
      return prestador;
    }

    Usuario usuario = new Usuario();
    usuario.setSenha(userDetailsDTO.senha());
    Contato contato = new Contato(null, userDetailsDTO.email());
    usuario.setContato(contato);
    usuario.setRole(userDetailsDTO.role());
    usuario.setNome(userDetailsDTO.nome());
    return usuario;
  }
}


