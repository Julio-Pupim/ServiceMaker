package br.com.servicemaker.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "CONTATO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Contato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String telefone;

    private String celular;

    private String email;

    @OneToOne
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private Usuario usuario;

}
