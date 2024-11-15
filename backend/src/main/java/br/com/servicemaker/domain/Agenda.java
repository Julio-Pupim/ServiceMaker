package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "AGENDA")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Agenda extends AbstractEntity {


  @OneToMany(mappedBy = "agenda", cascade = CascadeType.REMOVE)
  private List<CronogramaTrabalho> cronogramas;

  @OneToMany(mappedBy = "agenda")
  private List<Reserva> reservas;

}