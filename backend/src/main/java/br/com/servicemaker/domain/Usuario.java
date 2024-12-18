package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import br.com.servicemaker.domain.enums.Roles;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.apache.logging.log4j.util.Strings;
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
@DiscriminatorColumn(name = "tipo_usuario", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("CLIENTE")
@ToString(exclude = {"endereco", "avaliacoes", "reservas"})
@JsonIgnoreProperties(ignoreUnknown = true)
public class Usuario extends AbstractEntity implements UserDetails {


  @NotNull
  @NotBlank
  private String nome;

  @CPF
  private String cpf;

  @NotNull
  @NotBlank
  private String senha;

  @OneToMany(mappedBy = "usuario", fetch = FetchType.EAGER)
  @JsonManagedReference
  private List<Endereco> endereco;

  @Enumerated(EnumType.STRING)
  private Roles role;

  @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
  @JoinColumn(name = "id_contato")
  private Contato contato;

  @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @JsonIgnore
  private List<Reserva> reservas;

  @OneToMany(mappedBy = "cliente", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
  private List<Avaliacao> avaliacoes;

  public Usuario(String nome, String cpf, String senha, Contato contato, Endereco endereco,
      Roles role) {
    this.contato = contato;
    this.nome = nome;
    this.senha = senha;
    this.role = role;
    this.cpf = cpf;
    this.endereco = Collections.singletonList(endereco);
  }

  @Override
  @JsonIgnore
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority(Roles.ROLE_CLIENTE.getRole()));
  }

  @Override
  public String getPassword() {
    return this.senha;
  }

  @Override
  public String getUsername() {
    return Optional.ofNullable(this.getContato()).map(Contato::getEmail).orElse(Strings.EMPTY);
  }

  @Override
  public boolean isEnabled() {
    return true;
  }
}
