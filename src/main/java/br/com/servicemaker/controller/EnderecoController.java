package br.com.servicemaker.controller;

import br.com.servicemaker.AbstractCrud.AbstractController;
import br.com.servicemaker.domain.Endereco;
import br.com.servicemaker.repository.EnderecoRepository;
import br.com.servicemaker.service.EnderecoService;

public class EnderecoController extends AbstractController<Endereco, EnderecoRepository, EnderecoService> {

  public EnderecoController(EnderecoService service){
     super(service);
  }

}
