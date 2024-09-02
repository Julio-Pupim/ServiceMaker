package br.com.servicemaker;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "RESERVA")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "ID_CLIENTE", nullable = false)
    private Usuario cliente;

    @ManyToOne
    @JoinColumn(name = "ID_AGENDA", nullable = false)
    private Agenda agenda;

    @ManyToOne
    @JoinColumn(name = "ID_SERVICO", nullable = false)
    private Servico servico;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalTime horarioInicio;

    private LocalTime horarioFim;

    private LocalDateTime reservadoEm;


}

