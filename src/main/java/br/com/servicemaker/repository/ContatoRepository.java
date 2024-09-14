package br.com.servicemaker.repository;

import br.com.servicemaker.AbstractCrud.AbstractRepository;
import br.com.servicemaker.domain.Contato;
import org.springframework.stereotype.Repository;

@Repository
public interface ContatoRepository extends AbstractRepository<Contato> {

}
