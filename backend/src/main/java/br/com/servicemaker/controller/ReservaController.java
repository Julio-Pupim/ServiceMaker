package br.com.servicemaker.controller;

import br.com.servicemaker.abstractcrud.AbstractController;
import br.com.servicemaker.domain.Reserva;
import br.com.servicemaker.repository.ReservaRepository;
import br.com.servicemaker.service.ReservaService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/reservas")
public class ReservaController extends AbstractController<Reserva, ReservaRepository, ReservaService> {

  public ReservaController(ReservaService service){
    super(service);
  }

}
