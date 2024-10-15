package br.com.servicemaker.controller;

import br.com.servicemaker.abstractcrud.AbstractController;
import br.com.servicemaker.domain.Usuario;
import br.com.servicemaker.repository.UsuarioRepository;
import br.com.servicemaker.service.UsuarioService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController extends
    AbstractController<Usuario, UsuarioRepository, UsuarioService> {

  public UsuarioController(UsuarioService service){
    super(service);
  }

}
