package br.com.servicemaker.repository;

import br.com.servicemaker.abstractcrud.AbstractRepository;
import br.com.servicemaker.domain.Prestador;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface PrestadorRepository extends AbstractRepository<Prestador> {

  List<Prestador> findBySetorId(Long id);

}
