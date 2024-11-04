package br.com.servicemaker.controller;

import br.com.servicemaker.abstractcrud.AbstractController;
import br.com.servicemaker.domain.Agenda;
import br.com.servicemaker.repository.AgendaRepository;
import br.com.servicemaker.service.AgendaService;
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
@RequestMapping("/agenda")
public class AgendaController extends AbstractController<Agenda, AgendaRepository, AgendaService> {

  public AgendaController(AgendaService service) {
    super(service);
  }

  @GetMapping("/{idPrestador}/dias-disponiveis")
  public ResponseEntity<List<LocalDate>> findAllDiasDisponiveis(
      @PathVariable("idPrestador") Long idPrestador) {

    return null;
  }
}
