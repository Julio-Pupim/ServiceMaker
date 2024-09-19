package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "AGENDA")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Agenda extends AbstractEntity {


  private LocalDateTime dataInicio;

  private LocalDateTime dataFim;

  private Boolean disponivel;

  @ManyToOne
  @JoinColumn(name = "ID_PRESTADOR", nullable = false)
  private Prestador prestador;

  @OneToMany(mappedBy = "agenda")
  private List<CronogramaTrabalho> cronogramas;

  @OneToMany(mappedBy = "agenda")
  private List<Reserva> reservas;

}