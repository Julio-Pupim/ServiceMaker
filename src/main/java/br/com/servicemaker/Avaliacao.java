package br.com.servicemaker;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "AVALIACAO")
@Getter
@Setter
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer avaliacao;

    private String comentarioPrestador;

    private String comentarioCliente;

    @ManyToOne
    @JoinColumn(name = "ID_CLIENTE", nullable = false)
    private Usuario cliente;

    @ManyToOne
    @JoinColumn(name = "ID_PRESTADOR", nullable = false)
    private Prestador prestador;

}

