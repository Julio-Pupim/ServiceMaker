package br.com.servicemaker.domain;

import br.com.servicemaker.abstractcrud.AbstractEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

  @OneToOne(mappedBy = "usuario")
  private Endereco endereco;

  @OneToOne(mappedBy = "usuario")
  private Contato contato;

  @OneToMany(mappedBy = "cliente")
  private List<Reserva> reservas;

  @OneToMany(mappedBy = "usuario")
  private List<Avaliacao> avaliacoes;


}
