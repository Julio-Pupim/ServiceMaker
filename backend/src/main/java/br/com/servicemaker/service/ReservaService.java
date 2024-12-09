package br.com.servicemaker.service;

import br.com.servicemaker.DTO.ReservaDTO;
import br.com.servicemaker.abstractcrud.AbstractService;
import br.com.servicemaker.domain.Reserva;
import br.com.servicemaker.repository.ReservaRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReservaService extends AbstractService<Reserva, ReservaRepository> {

  private final ReservaRepository reservaRepository;

  @Autowired
  public ReservaService(ReservaRepository repository, EntityManager em) {
    super(repository, em);
    this.reservaRepository = repository;
  }

  public List<ReservaDTO> findAllReservasPorData(LocalDate data, Long usuarioId) {
    return reservaRepository.findAllReservasPorData(data, usuarioId);
  }

  public List<LocalDate> findAllReservasNoMes(Long usuarioId, LocalDate data) {

    LocalDate inicioDoMes = data.withDayOfMonth(1);
    LocalDate fimDoMes = data.withDayOfMonth(data.lengthOfMonth());

    return reservaRepository.findAllByDataReservaBetween(inicioDoMes, fimDoMes, usuarioId);
  }
}
