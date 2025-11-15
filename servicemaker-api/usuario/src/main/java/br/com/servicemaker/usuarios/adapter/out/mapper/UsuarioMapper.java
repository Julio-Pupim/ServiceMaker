package br.com.servicemaker.usuarios.adapter.out.mapper;

import br.com.servicemaker.usuarios.adapter.out.persistence.UsuarioEntity;
import br.com.servicemaker.usuarios.domain.model.Usuario;

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

}
