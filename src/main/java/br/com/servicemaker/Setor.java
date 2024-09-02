package br.com.servicemaker;

import jakarta.persistence.*;

@Entity
@Table(name = "SETOR")
public class Setor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String descricao;


}