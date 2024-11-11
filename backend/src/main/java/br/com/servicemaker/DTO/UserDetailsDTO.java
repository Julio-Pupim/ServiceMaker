package br.com.servicemaker.DTO;

import br.com.servicemaker.domain.enums.Roles;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public record UserDetailsDTO(String senha, String email, Roles role) {

  public List<SimpleGrantedAuthority> getAuthorities() {
    if (Roles.ROLE_PRESTADOR.equals(this.role)) {
      return List.of(new SimpleGrantedAuthority(Roles.ROLE_PRESTADOR.getRole()),
          new SimpleGrantedAuthority(Roles.ROLE_CLIENTE.getRole()));
    } else {
      return List.of(new SimpleGrantedAuthority(Roles.ROLE_CLIENTE.getRole()));
    }
  }

}
