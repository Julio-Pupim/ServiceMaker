package br.com.servicemaker.controller;

import br.com.servicemaker.DTO.ReservaDTO;
import br.com.servicemaker.abstractcrud.AbstractController;
import br.com.servicemaker.domain.Reserva;
import br.com.servicemaker.repository.ReservaRepository;
import br.com.servicemaker.service.ReservaService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/reservas")
public class ReservaController extends
    AbstractController<Reserva, ReservaRepository, ReservaService> {

  private final ReservaService reservaService;

  public ReservaController(ReservaService service) {
    super(service);
    this.reservaService = service;
  }

  @GetMapping("/{usuarioId}/{data}")
  public ResponseEntity<List<ReservaDTO>> findAllReservasPorData(
      @PathVariable("usuarioId") Long usuarioId, @PathVariable("data") LocalDate data) {
    List<ReservaDTO> reservasPorData = reservaService.findAllReservasPorData(data, usuarioId);
    return ResponseEntity.ok(reservasPorData);
  }

  @GetMapping("/mes/{usuarioId}/{data}")
  public ResponseEntity<List<LocalDate>> findAllReservasPorMes(
      @PathVariable("usuarioId") Long usuarioId, @PathVariable("data") LocalDate data) {
    return ResponseEntity.ok(reservaService.findAllReservasNoMes(usuarioId, data));
  }
}
