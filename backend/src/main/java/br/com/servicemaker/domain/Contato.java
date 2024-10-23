package br.com.servicemaker.domain;

import br.com.servicemaker.DTO.ContatoDTO;
import br.com.servicemaker.abstractcrud.AbstractEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "CONTATO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Contato extends AbstractEntity {

  private String telefone;

  private String celular;

  @Email
  @NotBlank
  @NotNull
  private String email;

  @OneToOne(mappedBy = "contato")
  private Usuario usuario;

  public Contato(ContatoDTO contato) {
    super();
    this.telefone = contato.telefone();
    this.celular = contato.celular();
    this.email = contato.email();
  }
}
