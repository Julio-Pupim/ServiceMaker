package br.com.servicemaker;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "USUARIO")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;

    private String cpf;

    private String senha;

    private Boolean prestador;

    @OneToOne(mappedBy = "usuario")
    private Endereco endereco;

    @OneToOne(mappedBy = "usuario")
    private Contato contato;

    @OneToMany(mappedBy = "cliente")
    private List<Reserva> reservas;

    @OneToMany(mappedBy = "usuario")
    private List<Avaliacao> avaliacoes;


}
