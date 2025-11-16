package br.com.servicemaker.usuarios.domain.model;

import br.com.servicemaker.usuarioapi.api.dto.UsuarioUpdateDto;
import com.github.f4b6a3.uuid.UuidCreator;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

public final class Usuario {

    private final UUID id;
    private final String nome;
    private final String email;
    private final String senhaHash;
    private final List<Role> roles;

    private Usuario(UUID id, String nome, String email, String senhaHash, List<Role> roles) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this.roles = roles;
    }

    public static Usuario createUsuario(String nome, String email, String senhaHash, List<Role> roles) {
        return new Usuario(UuidCreator.getTimeOrdered(), nome,email,senhaHash,roles);
    }

    public static Usuario rehydrate(UUID id, String nome, String email, String senhahash, List<Role> roles){
        return new Usuario(id,nome,email,senhahash,roles);
    }

    public static Usuario updateUser(UsuarioUpdateDto usuarioUpdateDto, Usuario usuario) {
        if (Objects.isNull(usuarioUpdateDto.nome()) && Objects.isNull(usuarioUpdateDto.email()))
            throw new IllegalArgumentException("nome e email nulos");
        if (Objects.isNull(usuarioUpdateDto.nome())) {
            return new Usuario(usuario.id, usuario.nome, usuarioUpdateDto.email(), usuario.senhaHash, usuario.roles);
        }
        if (Objects.isNull(usuarioUpdateDto.email())) {
            return new Usuario(usuario.id, usuarioUpdateDto.nome(), usuario.email, usuario.senhaHash, usuario.roles);
        }
        return new Usuario(usuario.id, usuarioUpdateDto.nome(), usuarioUpdateDto.email(), usuario.senhaHash, usuario.roles);
    }

    public UUID id() {
        return id;
    }

    public String nome() {
        return nome;
    }

    public String email() {
        return email;
    }

    public String senhaHash() {
        return senhaHash;
    }

    public List<Role> roles() {
        return roles;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) return true;
        if (obj == null || obj.getClass() != this.getClass()) return false;
        var that = (Usuario) obj;
        return Objects.equals(this.id, that.id) &&
                Objects.equals(this.nome, that.nome) &&
                Objects.equals(this.email, that.email) &&
                Objects.equals(this.senhaHash, that.senhaHash) &&
                Objects.equals(this.roles, that.roles);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nome, email, senhaHash, roles);
    }

    @Override
    public String toString() {
        return "Usuario[" +
                "id=" + id + ", " +
                "nome=" + nome + ", " +
                "email=" + email + ", " +
                "senhaHash=" + senhaHash + ", " +
                "roles=" + roles + ']';
    }

}
