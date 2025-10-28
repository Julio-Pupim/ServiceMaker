package br.com.servicemaker.usuarios.adapter.in.web;

import br.com.servicemaker.usuarios.api.UsuarioFacade;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuario")
@AllArgsConstructor
public class UsuarioController {

    private final UsuarioFacade usuarioFacade;

    @PostMapping("/registro")
    public ResponseEntity<Void> registrarUsuario(){
        usuarioFacade.registrarUsuario();
        return null;
    }

}
