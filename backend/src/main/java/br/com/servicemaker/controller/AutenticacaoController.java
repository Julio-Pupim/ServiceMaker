package br.com.servicemaker.controller;

import br.com.servicemaker.DTO.AuthenticationDTO;
import br.com.servicemaker.DTO.LoginResponseDTO;
import br.com.servicemaker.DTO.RegistroDTO;
import br.com.servicemaker.domain.Usuario;
import br.com.servicemaker.infra.seguranca.TokenService;
import br.com.servicemaker.repository.UsuarioRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/usuario")
public class AutenticacaoController {

    private AuthenticationManager authenticationManager;
    private UsuarioRepository repository;
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthenticationDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
        var servMaker = this.authenticationManager.authenticate(usernamePassword);

        var token = tokenService.gerarToken((Usuario) servMaker.getPrincipal());

        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @PostMapping("/registro")
    public ResponseEntity registro(@RequestBody @Valid RegistroDTO data) {

        if(this.repository.findByLogin(data.email()) != null) return ResponseEntity.badRequest().build();

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.Password());
        Usuario novoUsuario = new Usuario(data.email(), encryptedPassword, data.role());

        this.repository.save(novoUsuario);

        return ResponseEntity.ok().build();
    }

}
