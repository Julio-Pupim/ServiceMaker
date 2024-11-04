package br.com.servicemaker.repository;


import br.com.servicemaker.abstractcrud.AbstractRepository;
import br.com.servicemaker.domain.Agenda;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AgendaRepository extends AbstractRepository<Agenda> {

  @Query("SELECT a FROM Agenda a WHERE a.prestador.id = :idPrestador")
  Agenda findAgendaByPrestador(@Param("idPrestador") Long idPrestador);


}
