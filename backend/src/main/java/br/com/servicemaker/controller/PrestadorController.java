package br.com.servicemaker.controller;

import br.com.servicemaker.abstractcrud.AbstractController;
import br.com.servicemaker.domain.Prestador;
import br.com.servicemaker.repository.PrestadorRepository;
import br.com.servicemaker.service.PrestadorService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/prestadores")
public class PrestadorController extends
    AbstractController<Prestador, PrestadorRepository, PrestadorService> {

  private final PrestadorService prestadorService;

  public PrestadorController(PrestadorService service) {
    super(service);
    this.prestadorService = service;
  }

  @GetMapping("setores/{setorId}")
  public ResponseEntity<List<Prestador>> findAllPrestadoresBySetores(
      @PathVariable("setorId") Long idSetor) {
    List<Prestador> prestadores = prestadorService.findAllPrestadorBySetores(idSetor);
    return ResponseEntity.ok(prestadores);
  }

}
