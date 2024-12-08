package br.com.servicemaker.service;

import br.com.servicemaker.abstractcrud.AbstractService;
import br.com.servicemaker.domain.Reserva;
import br.com.servicemaker.repository.ReservaRepository;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservaService extends AbstractService<Reserva, ReservaRepository> {

  private final ReservaRepository reservaRepository;

  @Autowired
  public ReservaService(ReservaRepository repository, EntityManager em) {
    super(repository, em);
    this.reservaRepository = repository;
  }

  public List<Reserva> findAllReservasPorData(String data) {
    return reservaRepository.findAllReservasPorData(data);
  }

}
