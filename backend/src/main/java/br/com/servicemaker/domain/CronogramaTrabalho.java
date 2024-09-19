package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "CRONOGRAMA_TRABALHO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CronogramaTrabalho extends AbstractEntity {

  @ManyToOne
  @JoinColumn(name = "ID_AGENDA", nullable = false)
  private Agenda agenda;

  private Integer diaSemana;

  private LocalTime horaInicio;

  private LocalTime horaFim;

}