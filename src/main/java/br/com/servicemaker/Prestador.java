package br.com.servicemaker;

import jakarta.persistence.*;

import java.util.List;

@Ent                ity
@Table(name = "PRESTADOR")
public class Prestador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToMany(mappedBy = "prestador")
    private List<Agenda> agendas;

    @OneToMany(mappedBy = "prestador")
    private List<Servico> servicos;

    @OneToMany(mappedBy = "prestador")
    private List<Avaliacao> avaliacoes;

    @OneToMany(mappedBy = "prestador")
    private List<Certificado> certificados;

    @OneToMany(mappedBy = "prestador")
    private List<Reserva> reservas;


}