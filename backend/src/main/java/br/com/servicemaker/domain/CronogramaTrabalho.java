package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "CRONOGRAMA_TRABALHO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CronogramaTrabalho extends AbstractEntity {

  @ManyToOne()
  @JoinColumn(name = "ID_AGENDA", nullable = false)
  private Agenda agenda;

  @Column(name = "dia_semana")
  private Integer diaSemana;

  @Column(name = "hora_inicio")
  private LocalTime horaInicio;

  @Column(name = "hora_fim")
  private LocalTime horaFim;

}