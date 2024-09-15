package br.com.servicemaker.controller;

import br.com.servicemaker.AbstractCrud.AbstractController;
import br.com.servicemaker.domain.Prestador;
import br.com.servicemaker.repository.PrestadorRepository;
import br.com.servicemaker.service.PrestadorService;

public class PrestadorController extends AbstractController<Prestador, PrestadorRepository, PrestadorService> {

  public PrestadorController(PrestadorService service){
    super(service);
  }

}
