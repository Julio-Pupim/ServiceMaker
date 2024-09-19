package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "AVALIACAO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Avaliacao extends AbstractEntity {


  private Integer avaliacao;

  private String comentarioPrestador;

  private String comentarioCliente;

  @ManyToOne
  @JoinColumn(name = "ID_CLIENTE", nullable = false)
  private Usuario cliente;

  @ManyToOne
  @JoinColumn(name = "ID_PRESTADOR", nullable = false)
  private Prestador prestador;

  @ManyToOne
  @JoinColumn
  private Usuario usuario;

}

