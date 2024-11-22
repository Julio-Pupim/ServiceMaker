package br.com.servicemaker.controller;


import br.com.servicemaker.abstractcrud.AbstractController;
import br.com.servicemaker.domain.Servico;
import br.com.servicemaker.repository.ServicoRepository;
import br.com.servicemaker.service.ServicoService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/servicos")
public class ServicoController extends
    AbstractController<Servico, ServicoRepository, ServicoService> {

  private final ServicoService servicoService;

  public ServicoController(ServicoService service) {
    super(service);
    this.servicoService = service;
  }

  @GetMapping("/prestador/{idPrestador}")
  public ResponseEntity<List<Servico>> findAllServicosPorPrestador(@PathVariable Long idPrestador) {
    List<Servico> servicosPorPrestador = servicoService.findAllServicosPorPrestador(idPrestador);
    return ResponseEntity.ok(servicosPorPrestador);
  }
}
