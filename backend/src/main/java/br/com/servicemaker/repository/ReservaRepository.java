package br.com.servicemaker.repository;

import br.com.servicemaker.abstractcrud.AbstractRepository;
import br.com.servicemaker.domain.Reserva;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservaRepository extends AbstractRepository<Reserva> {

}
