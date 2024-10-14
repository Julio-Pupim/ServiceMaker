package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "USUARIO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Usuario extends AbstractEntity {

  private String nome;

  private String cpf;

  private String senha;

  private Boolean prestador;

  @OneToMany(mappedBy = "usuario")
  private List<Endereco> endereco;

  @OneToOne(orphanRemoval = true)
  @JoinColumn(name = "id_contato")
  private Contato contato;

  @OneToMany(mappedBy = "cliente", cascade = {CascadeType.REMOVE, CascadeType.MERGE})
  private List<Reserva> reservas;

  @OneToMany(mappedBy = "usuario", cascade = CascadeType.REMOVE)
  private List<Avaliacao> avaliacoes;


}
