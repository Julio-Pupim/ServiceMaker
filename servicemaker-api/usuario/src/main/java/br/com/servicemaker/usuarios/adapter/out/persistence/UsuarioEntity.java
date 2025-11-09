package br.com.servicemaker.usuarios.adapter.out.persistence;

import br.com.servicemaker.usuarios.domain.model.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UsuarioEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false, columnDefinition = "uuid")
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

    @Column(name = "senha_hash")
    private String senhaHash;

    @Column
    private Boolean ativo;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "usuario_roles", joinColumns = @JoinColumn(name = "usuario_id"))
    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private List<Role> roles;

    @CreationTimestamp
    @Column(name = "creat_at")
    private Instant creatAt;

    @UpdateTimestamp
    @Column(name = "update_at")
    private Instant updateAt;

    public UsuarioEntity(UUID ID, String nome, String email, String senhaHash, List<Role> roles) {
        this.ID = ID;
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this.roles = roles;
    }

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
