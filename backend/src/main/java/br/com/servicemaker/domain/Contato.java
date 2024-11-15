package br.com.servicemaker.domain;

import br.com.servicemaker.DTO.ContatoDTO;
import br.com.servicemaker.abstractcrud.AbstractEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "CONTATO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Contato extends AbstractEntity {

  @NotNull
  @NotBlank
  @Column(nullable = false)
  private String telefone;

  @Email
  @NotBlank
  @NotNull
  private String email;

  public Contato(ContatoDTO contato) {
    super();
    this.telefone = contato.telefone();
    this.email = contato.email();
  }
}
