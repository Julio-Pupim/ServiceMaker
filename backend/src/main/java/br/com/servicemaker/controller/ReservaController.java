package br.com.servicemaker.controller;

import br.com.servicemaker.abstractcrud.AbstractController;
import br.com.servicemaker.domain.Reserva;
import br.com.servicemaker.repository.ReservaRepository;
import br.com.servicemaker.service.ReservaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/reservas")
public class ReservaController extends AbstractController<Reserva, ReservaRepository, ReservaService> {

  private final ReservaService reservaService;

  public ReservaController(ReservaService service){
    super(service);
    this.reservaService = service;
  }

  @GetMapping("/reserva/{data}")
  public ResponseEntity<List<Reserva>> findAllReservasPorData(@PathVariable String data) {
    List<Reserva> reservasPorData = reservaService.findAllReservasPorData(data);
    return ResponseEntity.ok(reservasPorData);
  }

}
