package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import br.com.servicemaker.domain.enums.Status;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
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

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ID_CLIENTE", nullable = false)
  @JsonBackReference("clientes-reservas")
  private Usuario cliente;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ID_AGENDA", nullable = false)
  @JsonBackReference("agenda-reservas")
  private Agenda agenda;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ID_SERVICO", nullable = false)
  @JsonBackReference("reservas-servicos")
  private Servico servico;

  @Enumerated(EnumType.STRING)
  private Status status;

  @Column(name = "horario_inicio")
  private LocalTime horarioInicio;

  @Column(name = "horario_fim")
  private LocalTime horarioFim;

  @Column(name = "reservado_em")
  private LocalDateTime reservadoEm;


}

