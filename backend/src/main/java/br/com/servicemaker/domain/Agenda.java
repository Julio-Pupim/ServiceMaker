package br.com.servicemaker.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "AGENDA")
@Data
@AllArgsConstructor
@NoArgsConstructor
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