package br.com.servicemaker.domain;

import br.com.servicemaker.AbstractCrud.AbstractEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ENDERECO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Endereco extends AbstractEntity {


    private String cep;

    private String rua;

    private String numero;

    private String complemento;

    private String tipo;

    @OneToOne
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private Usuario usuario;

}
