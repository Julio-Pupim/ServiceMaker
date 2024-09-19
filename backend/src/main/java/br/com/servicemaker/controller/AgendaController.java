package br.com.servicemaker.controller;

import br.com.servicemaker.abstractcrud.AbstractController;
import br.com.servicemaker.domain.Agenda;
import br.com.servicemaker.repository.AgendaRepository;
import br.com.servicemaker.service.AgendaService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/agenda")
public class AgendaController extends AbstractController<Agenda, AgendaRepository, AgendaService> {

  public AgendaController(AgendaService service) {
      super(service);
  }

}
