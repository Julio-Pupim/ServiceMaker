package br.com.servicemaker.controller;

import br.com.servicemaker.abstractcrud.AbstractController;
import br.com.servicemaker.domain.Endereco;
import br.com.servicemaker.repository.EnderecoRepository;
import br.com.servicemaker.service.EnderecoService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/enderecos")
public class EnderecoController extends AbstractController<Endereco, EnderecoRepository, EnderecoService> {

  public EnderecoController(EnderecoService service){
     super(service);
  }

}
