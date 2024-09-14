package br.com.servicemaker.domain;

import br.com.servicemaker.AbstractCrud.AbstractEntity;
import jakarta.persistence.*;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "CERTIFICADO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Certificado extends AbstractEntity {


    private String nome;

    private Integer horas;

    private LocalDate dataEmissao;

    private byte[] arquivo;

    @ManyToOne
    @JoinColumn(name = "ID_PRESTADOR", nullable = false)
    private Prestador prestador;

}