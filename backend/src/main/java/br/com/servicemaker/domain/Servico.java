package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "SERVICO")
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"prestador", "reservas"})
public class Servico extends AbstractEntity {

  private String descricao;

  @Column(name = "tempo_servico")
  private LocalTime tempoServico;

  private Double preco;

  @ManyToOne
  @JoinColumn(name = "ID_PRESTADOR", nullable = false)
  @JsonBackReference("prestador-servico")
  private Prestador prestador;

  @OneToMany(mappedBy = "servico")
  @JsonIgnore
  private List<Reserva> reservas;

}