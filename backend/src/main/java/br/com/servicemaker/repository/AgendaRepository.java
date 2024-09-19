package br.com.servicemaker.repository;


import br.com.servicemaker.abstractcrud.AbstractRepository;
import br.com.servicemaker.domain.Agenda;
import org.springframework.stereotype.Repository;

@Repository
public interface AgendaRepository extends AbstractRepository<Agenda> {

}
