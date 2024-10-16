package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "CERTIFICADO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Certificado extends AbstractEntity {

  private String nome;

  private Integer horas;

  @Column(name = "data_emissao")
  private LocalDate dataEmissao;

  private byte[] arquivo;

  @ManyToOne(optional = false)
  @JoinColumn(name = "ID_PRESTADOR", nullable = false)
  private Prestador prestador;

}