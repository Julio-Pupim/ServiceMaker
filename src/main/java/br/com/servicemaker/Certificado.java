package br.com.servicemaker;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "CERTIFICADO")
public class Certificado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;

    private Integer horas;

    private LocalDate dataEmissao;

    private byte[] arquivo;

    @ManyToOne
    @JoinColumn(name = "ID_PRESTADOR", nullable = false)
    private Prestador prestador;

}