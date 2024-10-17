package br.com.servicemaker.controller;

import br.com.servicemaker.abstractcrud.AbstractController;
import br.com.servicemaker.domain.Avaliacao;
import br.com.servicemaker.repository.AvaliacaoRepository;
import br.com.servicemaker.service.AvaliacaoService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/avaliacoes")
public class AvaliacaoController extends AbstractController<Avaliacao, AvaliacaoRepository, AvaliacaoService> {

  public AvaliacaoController(AvaliacaoService service) {
    super(service);
  }

}