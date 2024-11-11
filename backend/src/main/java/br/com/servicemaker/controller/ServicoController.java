package br.com.servicemaker.controller;


import br.com.servicemaker.abstractcrud.AbstractController;
import br.com.servicemaker.domain.Servico;
import br.com.servicemaker.repository.ServicoRepository;
import br.com.servicemaker.service.ServicoService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/servicos")
@PreAuthorize("hasRole('PRESTADOR')")
public class ServicoController extends
    AbstractController<Servico, ServicoRepository, ServicoService> {

  public ServicoController(ServicoService service) {
    super(service);
  }

}
