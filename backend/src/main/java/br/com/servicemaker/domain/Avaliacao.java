package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "AVALIACAO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Avaliacao extends AbstractEntity {

  @Column(name = "avaliacao_prestador")
  private Integer avaliacaoPrestador;

  @Column(name = "avaliacao_cliente")
  private Integer avaliacaoCliente;

  @Column(name = "comentario_prestador")
  private String comentarioPrestador;

  @Column(name = "comentario_cliente")
  private String comentarioCliente;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ID_CLIENTE", nullable = false)
  @JsonBackReference
  private Usuario cliente;

}

