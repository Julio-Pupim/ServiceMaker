package br.com.servicemaker.controller;

import br.com.servicemaker.AbstractCrud.AbstractController;
import br.com.servicemaker.domain.Avaliacao;
import br.com.servicemaker.repository.AvaliacaoRepository;
import br.com.servicemaker.service.AvaliacaoService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/avaliacao")
public class AvaliacaoController extends AbstractController<Avaliacao, AvaliacaoRepository, AvaliacaoService> {

  public AvaliacaoController(AvaliacaoService service) {
    super(service);
  }

}