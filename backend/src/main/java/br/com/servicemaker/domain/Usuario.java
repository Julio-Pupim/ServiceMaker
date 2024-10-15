package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import jakarta.persistence.CascadeType;
import br.com.servicemaker.domain.enums.Roles;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.*;

import java.util.Collection;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.br.CPF;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "USUARIO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Usuario extends AbstractEntity implements UserDetails {

  private String nome;

  @CPF
  private String cpf;

  private String senha;

  private Boolean prestador;

  @OneToMany(mappedBy = "usuario")
  private List<Endereco> endereco;

  @Enumerated
  private Roles role;

  public Usuario(String email, String password, Roles role){
    this.email = email;
    this.senha = senha;
    this.role = role;
  }

  @OneToOne(mappedBy = "usuario")
  private Endereco endereco;

  @OneToOne(orphanRemoval = true)
  @JoinColumn(name = "id_contato")
  private Contato contato;

  @OneToMany(mappedBy = "cliente", cascade = {CascadeType.REMOVE, CascadeType.MERGE})
  private List<Reserva> reservas;

  @OneToMany(mappedBy = "cliente", cascade = CascadeType.REMOVE)
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
