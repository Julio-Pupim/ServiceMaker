package br.com.servicemaker.repository;

import br.com.servicemaker.AbstractCrud.AbstractRepository;
import br.com.servicemaker.domain.Servico;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicoRepository extends AbstractRepository<Servico> {

}
