package br.com.servicemaker.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = false)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@DiscriminatorValue("prestador")
public class Prestador extends Usuario {

  @Column(name = "tipo_usuario", insertable = false, updatable = false)
  private String tipoUsuario;

  @OneToOne(cascade = {CascadeType.REMOVE,
      CascadeType.MERGE}, optional = false, orphanRemoval = true)
  @JoinColumn(name = "id_agenda", nullable = false, referencedColumnName = "id")
  private Agenda agenda;

  @OneToMany(mappedBy = "prestador", cascade = {CascadeType.REMOVE, CascadeType.MERGE})
  private List<Servico> servicos;

  @OneToMany(mappedBy = "prestador", cascade = {CascadeType.REMOVE,
      CascadeType.MERGE}, orphanRemoval = true)
  private List<Certificado> certificados;


}