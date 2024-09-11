package br.com.servicemaker.domain;

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