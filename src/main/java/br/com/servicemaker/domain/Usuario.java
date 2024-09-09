package br.com.servicemaker.domain;

import jakarta.persistence.*;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "USUARIO")
@Data
@AllArgsConstructor
@NoArgsConstructor
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
