package br.com.servicemaker.controller;

import br.com.servicemaker.abstractcrud.AbstractController;
import br.com.servicemaker.domain.Prestador;
import br.com.servicemaker.repository.PrestadorRepository;
import br.com.servicemaker.service.PrestadorService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/prestadores")
public class PrestadorController extends
    AbstractController<Prestador, PrestadorRepository, PrestadorService> {

  public PrestadorController(PrestadorService service) {
    super(service);
  }

}
