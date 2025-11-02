package br.com.servicemaker.usuarios.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UsuarioEntityRepository extends JpaRepository<UsuarioEntity, UUID> {
}
