package br.com.servicemaker.repository;

import br.com.servicemaker.DTO.ReservaDTO;
import br.com.servicemaker.abstractcrud.AbstractRepository;
import br.com.servicemaker.domain.Reserva;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservaRepository extends AbstractRepository<Reserva> {

  @Query("""
          SELECT new br.com.servicemaker.DTO.ReservaDTO(
              r.prestador.nome,
              r.cliente.nome,
              r.servico,
              r.status,
              r.horarioInicio,
              r.horarioFim,
              r.reservadoEm
          )
          FROM Reserva r
          JOIN r.prestador p
          WHERE r.dataReserva = :data
          AND (r.cliente.id = :usuarioId OR p.id = :usuarioId)
      """)
  List<ReservaDTO> findAllReservasPorData(@Param("data") LocalDate data,
      @Param("usuarioId") Long usuarioId);

  @Query("SELECT r.dataReserva FROM Reserva r WHERE r.dataReserva BETWEEN :dataInicio AND :dataFim AND(r.cliente.id = :usuarioId OR r.prestador.id = :usuarioId)")
  List<LocalDate> findAllByDataReservaBetween(@Param("dataInicio") LocalDate dataInicio,
      @Param("dataFim") LocalDate dataFim, @Param("usuarioId") Long usuarioId);

}
