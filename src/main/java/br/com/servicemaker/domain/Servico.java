package br.com.servicemaker.domain;

import br.com.servicemaker.AbstractCrud.AbstractEntity;
import jakarta.persistence.*;

import java.time.LocalTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "SERVICO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Servico extends AbstractEntity {

    @ManyToOne
    @JoinColumn(name = "ID_SETOR", nullable = false)
    private Setor setor;

    private String descricao;

    private LocalTime tempoServico;

    private Double preco;

    @ManyToOne
    @JoinColumn(name = "ID_PRESTADOR", nullable = false)
    private Prestador prestador;

    @OneToMany(mappedBy = "servico")
    private List<Reserva> reservas;

}