package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import br.com.servicemaker.domain.enums.Status;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "RESERVA")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reserva extends AbstractEntity {

  @ManyToOne(optional = false)
  @JoinColumn(name = "ID_CLIENTE", nullable = false)
  private Usuario cliente;

  @ManyToOne(optional = false)
  @JoinColumn(name = "ID_AGENDA", nullable = false)
  private Agenda agenda;

  @ManyToOne(optional = false)
  @JoinColumn(name = "ID_SERVICO", nullable = false)
  private Servico servico;

  @ManyToOne(optional = false)
  @JoinColumn(name = "id_prestador", nullable = false)
  private Prestador prestador;

  @Enumerated(EnumType.STRING)
  private Status status;

  @Column(name = "horario_inicio")
  private LocalTime horarioInicio;

  @Column(name = "horario_fim")
  private LocalTime horarioFim;

  @Column(name = "reservado_em")
  private LocalDateTime reservadoEm;


}

