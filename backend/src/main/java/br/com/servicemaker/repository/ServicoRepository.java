package br.com.servicemaker.repository;

import br.com.servicemaker.abstractcrud.AbstractRepository;
import br.com.servicemaker.domain.Servico;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicoRepository extends AbstractRepository<Servico> {

  @Query("SELECT s FROM Servico s WHERE s.prestador.id = :idPrestador ")
  List<Servico> findAllServicosPorPrestador(@Param("idPrestador") Long idPrestador);
}
