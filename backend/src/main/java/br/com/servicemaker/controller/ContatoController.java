package br.com.servicemaker.controller;

import br.com.servicemaker.abstractcrud.AbstractController;
import br.com.servicemaker.domain.Contato;
import br.com.servicemaker.repository.ContatoRepository;
import br.com.servicemaker.service.ContatoService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/contatos")
public class ContatoController extends AbstractController<Contato, ContatoRepository, ContatoService> {

  public ContatoController(ContatoService service) {
    super(service);
  }

}
