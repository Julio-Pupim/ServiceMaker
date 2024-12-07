package br.com.servicemaker.repository;

import br.com.servicemaker.abstractcrud.AbstractRepository;
import br.com.servicemaker.domain.Reserva;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservaRepository extends AbstractRepository<Reserva> {

    @Query("SELECT r FROM Reserva r WHERE r.reservadoEm = :data")
    List<Reserva> findAllReservasPorData(@Param("data") String data);
}
