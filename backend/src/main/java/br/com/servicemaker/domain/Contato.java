package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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

  private String email;

  @OneToOne
  @JoinColumn(name = "ID_USUARIO", nullable = false)
  private Usuario usuario;

}
