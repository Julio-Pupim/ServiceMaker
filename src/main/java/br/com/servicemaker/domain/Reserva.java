package br.com.servicemaker.domain;

import br.com.servicemaker.domain.enums.Status;
import jakarta.persistence.*;

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

