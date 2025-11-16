package br.com.servicemaker.usuarios.adapter.in.web;

import br.com.servicemaker.usuarioapi.api.UsuarioFacade;
import br.com.servicemaker.usuarioapi.api.dto.UsuarioRequest;
import br.com.servicemaker.usuarioapi.api.dto.UsuarioResponseDto;
import br.com.servicemaker.usuarioapi.api.dto.UsuarioUpdateDto;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponseDto> getPerfilUsuarioLogado(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        UsuarioResponseDto profile = usuarioFacade.findProfileByEmail(email);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<UsuarioResponseDto> updateMeuPerfil(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UsuarioUpdateDto updateDto
    ) {
        String email = userDetails.getUsername();

        UsuarioResponseDto profileAtualizado = usuarioFacade.updateProfile(email, updateDto);

        return ResponseEntity.ok(profileAtualizado);
    }
}
