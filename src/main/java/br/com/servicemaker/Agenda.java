package br.com.servicemaker;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "AGENDA")
public class Agenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

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