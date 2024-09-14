package br.com.servicemaker.domain;

import br.com.servicemaker.AbstractCrud.AbstractEntity;
import br.com.servicemaker.domain.enums.Status;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "RESERVA")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reserva extends AbstractEntity {

  @ManyToOne
  @JoinColumn(name = "ID_CLIENTE", nullable = false)
  private Usuario cliente;

  @ManyToOne
  @JoinColumn(name = "ID_AGENDA", nullable = false)
  private Agenda agenda;

  @ManyToOne
  @JoinColumn(name = "ID_SERVICO", nullable = false)
  private Servico servico;

  @ManyToOne
  @JoinColumn
  private Prestador prestador;

  @Enumerated(EnumType.STRING)
  private Status status;

  private LocalTime horarioInicio;

  private LocalTime horarioFim;

  private LocalDateTime reservadoEm;


}

