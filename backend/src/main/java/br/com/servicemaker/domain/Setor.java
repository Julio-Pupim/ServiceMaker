package br.com.servicemaker.domain;

import br.com.servicemaker.AbstractCrud.AbstractEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "SETOR")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Setor extends AbstractEntity {

    private String descricao;

}