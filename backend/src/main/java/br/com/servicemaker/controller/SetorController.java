package br.com.servicemaker.controller;


import br.com.servicemaker.abstractcrud.AbstractController;
import br.com.servicemaker.domain.Setor;
import br.com.servicemaker.repository.SetorRepository;
import br.com.servicemaker.service.SetorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/setores")
public class SetorController extends
    AbstractController<Setor, SetorRepository, SetorService> {

  public SetorController(SetorService service, SetorRepository setorRepository) {
    super(service);
  }

}
