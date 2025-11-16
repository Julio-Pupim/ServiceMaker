package br.com.servicemaker.usuarios.adapter.out.mapper;

import br.com.servicemaker.usuarioapi.api.dto.UsuarioResponseDto;
import br.com.servicemaker.usuarios.adapter.out.persistence.UsuarioEntity;
import br.com.servicemaker.usuarios.domain.model.Role;
import br.com.servicemaker.usuarios.domain.model.Usuario;

import java.util.stream.Collectors;

public final class UsuarioMapper {

    private UsuarioMapper(){}

    public static UsuarioEntity toEntity(Usuario domain){
        return new UsuarioEntity(domain.id(),domain.nome(),
                domain.email(), domain.senhaHash(), true, domain.roles());
    }

    public static Usuario toDomain(UsuarioEntity entity){
        return Usuario.rehydrate(entity.getID(), entity.getNome(), entity.getEmail(),
                    entity.getSenhaHash(), entity.getRoles());
    }

    public static UsuarioResponseDto mapToResponseDto(Usuario usuario) {
        return new UsuarioResponseDto(
                usuario.id(),
                usuario.nome(),
                usuario.email(),
                true,
                // Converte a List<Role> (enum) para List<String>
                usuario.roles().stream().map(Role::name).collect(Collectors.toList())
        );
    }

}
