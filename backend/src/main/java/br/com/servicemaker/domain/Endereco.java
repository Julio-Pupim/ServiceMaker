package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "ENDERECO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Endereco extends AbstractEntity {

  private String cep;

  private String rua;

  private String numero;

  private String complemento;

  private String tipo;

  @ManyToOne(optional = false)
  @JoinColumn(name = "ID_USUARIO", nullable = false)
  private Usuario usuario;

}
