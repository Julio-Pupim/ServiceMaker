package br.com.servicemaker.controller;


import br.com.servicemaker.abstractcrud.AbstractController;
import br.com.servicemaker.domain.Servico;
import br.com.servicemaker.repository.ServicoRepository;
import br.com.servicemaker.service.ServicoService;

public class ServicoController extends
    AbstractController<Servico, ServicoRepository, ServicoService> {

  public ServicoController(ServicoService service){
    super(service);
  }

}
