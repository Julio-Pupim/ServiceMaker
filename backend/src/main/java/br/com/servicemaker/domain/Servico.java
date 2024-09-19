package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "SERVICO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Servico extends AbstractEntity {

  @ManyToOne
  @JoinColumn(name = "ID_SETOR", nullable = false)
  private Setor setor;

  private String descricao;

  private LocalTime tempoServico;

  private Double preco;

  @ManyToOne
  @JoinColumn(name = "ID_PRESTADOR", nullable = false)
  private Prestador prestador;

  @OneToMany(mappedBy = "servico")
  private List<Reserva> reservas;

}