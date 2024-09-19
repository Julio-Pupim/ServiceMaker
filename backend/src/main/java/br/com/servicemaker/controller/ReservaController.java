package br.com.servicemaker.controller;

import br.com.servicemaker.AbstractCrud.AbstractController;
import br.com.servicemaker.domain.Reserva;
import br.com.servicemaker.repository.ReservaRepository;
import br.com.servicemaker.service.ReservaService;

public class ReservaController extends AbstractController<Reserva, ReservaRepository, ReservaService> {

  public ReservaController(ReservaService service){
    super(service);
  }

}
