package br.com.servicemaker.usuarios.adapter.in.web;

import br.com.servicemaker.usuarioapi.api.UsuarioFacade;
import br.com.servicemaker.usuarioapi.api.dto.UsuarioRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuario")
@AllArgsConstructor
public class UsuarioController {

    private final UsuarioFacade usuarioFacade;

    @PostMapping("/registro")
    public ResponseEntity<Void> registrarUsuario(@RequestBody @Valid UsuarioRequest newUsuario) {
        usuarioFacade.registrarUsuario(newUsuario);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
