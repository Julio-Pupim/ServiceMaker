package br.com.servicemaker;

import jakarta.persistence.*;

import java.time.LocalTime;

@Entity
@Table(name = "CRONOGRAMA_TRABALHO")
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