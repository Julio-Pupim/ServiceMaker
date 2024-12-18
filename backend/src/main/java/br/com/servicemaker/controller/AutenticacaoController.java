package br.com.servicemaker.controller;

import br.com.servicemaker.DTO.AuthenticationDTO;
import br.com.servicemaker.DTO.LoginResponseDTO;
import br.com.servicemaker.DTO.RegistroDTO;
import br.com.servicemaker.domain.Agenda;
import br.com.servicemaker.domain.Contato;
import br.com.servicemaker.domain.Endereco;
import br.com.servicemaker.domain.Prestador;
import br.com.servicemaker.domain.Setor;
import br.com.servicemaker.domain.Usuario;
import br.com.servicemaker.domain.enums.Roles;
import br.com.servicemaker.infra.seguranca.TokenService;
import br.com.servicemaker.repository.UsuarioRepository;
import br.com.servicemaker.service.SetorService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AutenticacaoController {

  private final AuthenticationManager authenticationManager;
  private final UsuarioRepository repository;
  private final TokenService tokenService;
  private final BCryptPasswordEncoder passwordEncoder;
  private final SetorService setorService;

  @PostMapping("/login")
  public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthenticationDTO data) {
    var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
    var servMaker = this.authenticationManager.authenticate(usernamePassword);

    var token = tokenService.gerarToken((Usuario) servMaker.getPrincipal());

    return ResponseEntity.ok(
        new LoginResponseDTO(token, (Usuario) servMaker.getPrincipal()));
  }

  @PostMapping("/registro")
  @Transactional
  public ResponseEntity<Usuario> registro(@RequestBody @Valid RegistroDTO data) {

    if (this.repository.findByContatoEmail(data.contato().email()) != null) {
      return ResponseEntity.badRequest().build();
    }
    String encryptedPassword = passwordEncoder.encode(data.senha());
    Contato contato = new Contato(data.contato());
    Endereco endereco = new Endereco(data.endereco());

    if (data.prestador()) {
      Setor setor = setorService.findById(data.setorId());
      Prestador novoPrestador = new Prestador(data.nome(), data.cpf(), encryptedPassword, contato,
          endereco, Roles.ROLE_PRESTADOR, new Agenda(), setor);
      endereco.setUsuario(novoPrestador);
      Prestador saved = this.repository.save(novoPrestador);
      return ResponseEntity.ok(saved);
    }
    Usuario novoUsuario = new Usuario(data.nome(), data.cpf(), encryptedPassword, contato,
        endereco, Roles.ROLE_CLIENTE);
    endereco.setUsuario(novoUsuario);
    Usuario saved = this.repository.save(novoUsuario);

    return ResponseEntity.ok(saved);

  }

}
