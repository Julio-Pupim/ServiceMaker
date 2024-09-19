package br.com.servicemaker.controller;


import br.com.servicemaker.abstractcrud.AbstractController;
import br.com.servicemaker.domain.Setor;
import br.com.servicemaker.repository.SetorRepository;
import br.com.servicemaker.service.SetorService;

public class SetorController extends
    AbstractController<Setor, SetorRepository, SetorService> {

  public SetorController(SetorService service){
    super(service);
  }

}
