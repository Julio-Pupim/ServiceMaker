package br.com.servicemaker.controller;

import br.com.servicemaker.abstractcrud.AbstractController;
import br.com.servicemaker.domain.Usuario;
import br.com.servicemaker.repository.UsuarioRepository;
import br.com.servicemaker.service.UsuarioService;



public class UsuarioController extends
    AbstractController<Usuario, UsuarioRepository, UsuarioService> {

  public UsuarioController(UsuarioService service){
    super(service);
  }

}
