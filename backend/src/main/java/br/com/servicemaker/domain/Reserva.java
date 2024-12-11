package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import br.com.servicemaker.domain.enums.Status;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "RESERVA")
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"cliente", "prestador", "agenda"})
public class Reserva extends AbstractEntity {

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ID_CLIENTE", nullable = false)
  private Usuario cliente;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_prestador", nullable = false)
  private Prestador prestador;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ID_AGENDA", nullable = false)
  private Agenda agenda;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ID_SERVICO", nullable = false)
  private Servico servico;

  @NotNull
  @Enumerated(EnumType.STRING)
  private Status status;

  @NotNull
  @Column(name = "horario_inicio")
  private LocalTime horarioInicio;

  @NotNull
  @Column(name = "horario_fim")
  private LocalTime horarioFim;

  @NotNull
  @Column(name = "data_reserva")
  private LocalDate dataReserva;

  @NotNull
  @Column(name = "reservado_em")
  private LocalDateTime reservadoEm = LocalDateTime.now();


}

