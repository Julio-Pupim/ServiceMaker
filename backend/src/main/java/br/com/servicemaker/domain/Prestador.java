package br.com.servicemaker.domain;

import br.com.servicemaker.domain.enums.Roles;
import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import java.util.Collection;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@EqualsAndHashCode(callSuper = false)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@DiscriminatorValue("prestador")
public class Prestador extends Usuario {


  @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
  @JoinColumn(name = "id_agenda", nullable = false, referencedColumnName = "id")
  private Agenda agenda;

  @OneToMany(mappedBy = "prestador", cascade = {CascadeType.REMOVE, CascadeType.MERGE})
  private List<Servico> servicos;

  @OneToMany(mappedBy = "prestador", cascade = {CascadeType.REMOVE,
      CascadeType.MERGE}, orphanRemoval = true)
  private List<Certificado> certificados;

  public Prestador(String nome, String cpf, String senha, Contato contato, Endereco endereco,
      Roles role,
      Agenda agenda) {
    super(nome, cpf, senha, contato, endereco, role);
    this.agenda = agenda;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority(Roles.ROLE_PRESTADOR.getRole()),
        new SimpleGrantedAuthority(Roles.ROLE_CLIENTE.getRole()));
  }
}