package br.com.servicemaker.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class Avaliacao {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

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

