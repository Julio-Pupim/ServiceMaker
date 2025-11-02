package br.com.servicemaker.usuarios.adapter.out.persistence;

import br.com.servicemaker.usuarios.domain.model.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;
import org.hibernate.annotations.UuidGenerator;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "usuario")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UsuarioEntity {

    @Id
    @UuidGenerator
    private UUID ID;

//    @OneToOne
//    @JoinColumn
//    private Prestador prestador;
//
//    @OneToOne
//    @JoinColumn
//    private Cliente cliente;

    @Column
    private String nome;

    @Email
    @Column
    private String email;

    @Column
    private String senhaHash;

    @Column
    private List<Role> roles;

    @Override
    public boolean equals(Object o) {
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        UsuarioEntity that = (UsuarioEntity) o;
        return Objects.equals(ID, that.ID) && Objects.equals(nome, that.nome) && Objects.equals(email, that.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nome, email);
    }

    @Override
    public String toString() {
        return "UsuarioEntity{" +
                "ID=" + ID +
                ", nome='" + nome + '\'' +
                ", email='" + email + '\'' +
                ", roles=" + roles +
                '}';
    }
}
