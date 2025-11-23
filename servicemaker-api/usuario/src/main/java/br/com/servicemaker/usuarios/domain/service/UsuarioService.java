package br.com.servicemaker.usuarios.domain.service;

import br.com.servicemaker.security.PasswordPort;
import br.com.servicemaker.usuarioapi.api.UsuarioFacade;
import br.com.servicemaker.usuarioapi.api.dto.UsuarioAuthDto;
import br.com.servicemaker.usuarioapi.api.dto.UsuarioRequest;
import br.com.servicemaker.usuarioapi.api.dto.UsuarioResponseDto;
import br.com.servicemaker.usuarioapi.api.dto.UsuarioUpdateDto;
import br.com.servicemaker.usuarios.adapter.out.mapper.UsuarioMapper;
import br.com.servicemaker.usuarios.domain.model.Role;
import br.com.servicemaker.usuarios.domain.model.Usuario;
import br.com.servicemaker.usuarios.domain.port_out.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static br.com.servicemaker.usuarios.adapter.out.mapper.UsuarioMapper.mapToResponseDto;
import static br.com.servicemaker.usuarios.domain.model.Usuario.updateUser;

@Service
@AllArgsConstructor
public class UsuarioService implements UsuarioFacade {

    private final UsuarioRepository usuarioRepository;
    private final PasswordPort passwordPort;


    @Override
    @Transactional(readOnly = true)
    public Optional<UsuarioAuthDto> findAuthInfoByEmail(String email) {
        return usuarioRepository.findByEmail(email).map(usuario ->
                new UsuarioAuthDto(usuario.id(), usuario.email(), usuario.senhaHash(), usuario.roles().stream().map(Enum::name).toList()));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UsuarioAuthDto> findAuthInfoById(UUID id) {
        return Optional.empty();
    }

    @Override
    public UUID registrarUsuario(UsuarioRequest request) {
        if (usuarioRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }
        String senhaHash = passwordPort.encode(request.senha());
        List<Role> domainRoles = request.roles().stream().map(
                role -> {
                    try {
                        return Role.valueOf(role.toUpperCase());
                    } catch (IllegalArgumentException e) {
                        throw new IllegalArgumentException("Role Inválida: " + role);
                    }
                }).toList();
        Usuario novoUsuario = Usuario.createUsuario(
                request.nome(),
                request.email(),
                senhaHash,
                domainRoles
        );
        usuarioRepository.save(novoUsuario);
        return novoUsuario.id();
    }

    @Override
    public UsuarioResponseDto findProfileByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .map(UsuarioMapper::mapToResponseDto) // Converte o Domínio para DTO
                .orElseThrow(() ->
                        new UsernameNotFoundException("Usuário não encontrado com email: " + email)
                );
    }

    @Override
    @Transactional
    public UsuarioResponseDto updateProfile(String email, UsuarioUpdateDto updateDto) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Usuário não encontrado com email: " + email)
                );

        Usuario usuarioAtualizado = updateUser(updateDto, usuario);

        usuarioRepository.save(usuarioAtualizado);

        return mapToResponseDto(usuarioAtualizado);
    }


}
