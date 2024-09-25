package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import br.com.servicemaker.domain.enums.Roles;
import jakarta.persistence.*;

import java.util.Collection;
import java.util.List;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.br.CPF;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "USUARIO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Usuario extends AbstractEntity implements UserDetails {

  private String nome;

  @CPF
  private String cpf;

  @Email
  private String email;

  private String senha;

  private Boolean prestador;

  @Enumerated
  private Roles role;

  @OneToOne(mappedBy = "usuario")
  private Endereco endereco;

  @OneToOne(mappedBy = "usuario")
  private Contato contato;

  @OneToMany(mappedBy = "cliente")
  private List<Reserva> reservas;

  @OneToMany(mappedBy = "usuario")
  private List<Avaliacao> avaliacoes;


  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    if(Roles.Prestador.equals(this.role)) return List.of(new SimpleGrantedAuthority("Prestador"), new SimpleGrantedAuthority("Cliente"));
    else return List.of(new SimpleGrantedAuthority("Cliente"));
  }

  @Override
  public String getPassword() {
    return "";
  }

  @Override
  public String getUsername() {
    return "";
  }

  @Override
  public boolean isEnabled() {
    return UserDetails.super.isEnabled();
  }
}
