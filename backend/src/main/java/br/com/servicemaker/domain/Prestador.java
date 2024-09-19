package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "PRESTADOR")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Prestador extends AbstractEntity {

  @OneToMany(mappedBy = "prestador")
  private List<Agenda> agendas;

  @OneToMany(mappedBy = "prestador")
  private List<Servico> servicos;

  @OneToMany(mappedBy = "prestador")
  private List<Avaliacao> avaliacoes;

  @OneToMany(mappedBy = "prestador")
  private List<Certificado> certificados;

  @OneToMany(mappedBy = "prestador")
  private List<Reserva> reservas;


}