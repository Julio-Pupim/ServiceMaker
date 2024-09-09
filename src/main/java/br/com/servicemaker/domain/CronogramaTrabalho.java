package br.com.servicemaker.domain;

import jakarta.persistence.*;

import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "CRONOGRAMA_TRABALHO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CronogramaTrabalho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ID_AGENDA", nullable = false)
    private Agenda agenda;

    private Integer diaSemana;

    private LocalTime horaInicio;

    private LocalTime horaFim;

}