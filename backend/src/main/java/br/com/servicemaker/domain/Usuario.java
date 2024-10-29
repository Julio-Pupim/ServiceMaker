package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import br.com.servicemaker.domain.enums.Roles;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Collection;
import java.util.Collections;
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


  @NotNull
  @NotBlank
  private String nome;

  @CPF
  private String cpf;

  @NotNull
  @NotBlank
  private String senha;

  private Boolean prestador;

  @OneToMany(mappedBy = "usuario")
  private List<Endereco> endereco;

  @Enumerated
  private Roles role;

  @OneToOne(optional = false, cascade = CascadeType.REMOVE, orphanRemoval = true)
  @JoinColumn(name = "id_contato")
  private Contato contato;

  @OneToMany(mappedBy = "cliente", cascade = {CascadeType.REMOVE, CascadeType.MERGE})
  private List<Reserva> reservas;

  @OneToMany(mappedBy = "cliente", cascade = CascadeType.REMOVE)
  private List<Avaliacao> avaliacoes;

  public Usuario(String nome, String cpf, String senha, Contato contato, Endereco endereco,
      Boolean prestador, Roles role) {
    this.contato = contato;
    this.nome = nome;
    this.senha = senha;
    this.role = role;
    this.cpf = cpf;
    this.prestador = prestador;
    this.endereco = Collections.singletonList(endereco);
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    if (Roles.Prestador.equals(this.role)) {
      return List.of(new SimpleGrantedAuthority("ROLE_PRESTADOR"),
          new SimpleGrantedAuthority("ROLE_CLIENTE"));
    } else {
      return List.of(new SimpleGrantedAuthority("ROLE_CLIENTE"));
    }
  }

  @Override
  public String getPassword() {
    return this.getSenha();
  }

  @Override
  public String getUsername() {
    return this.getContato().getEmail();
  }

  @Override
  public boolean isEnabled() {
    return UserDetails.super.isEnabled();
  }
}
