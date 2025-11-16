package br.com.servicemaker.auth.domain.service;

import br.com.servicemaker.auth.domain.model.AccessToken;
import br.com.servicemaker.auth.domain.model.RefreshToken;
import br.com.servicemaker.auth.domain.port_out.RefreshTokenRepository;
import br.com.servicemaker.auth.domain.port_out.TokenPort;
import br.com.servicemaker.auth.domain.port_out.UsuarioPort;
import br.com.servicemaker.authapi.api.AuthFacade;
import br.com.servicemaker.authapi.api.dto.LoginRequest;
import br.com.servicemaker.authapi.api.dto.RefreshRequest;
import br.com.servicemaker.authapi.api.dto.TokenResponse;
import br.com.servicemaker.security.PasswordPort;
import br.com.servicemaker.usuarioapi.api.dto.UsuarioAuthDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService implements AuthFacade, UserDetailsService {

    private final UsuarioPort usuarioPort;
    private final PasswordPort passwordPort;
    private final TokenPort tokenPort;
    private final RefreshTokenRepository refreshRepo;
    private final AuthenticationManager authenticationManager;

    public AuthService(UsuarioPort usuarioPort, PasswordPort passwordPort, TokenPort tokenPort,
                       RefreshTokenRepository refreshRepo, @Lazy AuthenticationManager authenticationManager) {
        this.usuarioPort = usuarioPort;
        this.passwordPort = passwordPort;
        this.tokenPort = tokenPort;
        this.refreshRepo = refreshRepo;
        this.authenticationManager = authenticationManager;
    }


    @Override
    public TokenResponse authenticate(LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.senha()));

        var userDetails = (UserDetails) authentication.getPrincipal();

        var user = usuarioPort.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado após autenticação"));


        AccessToken accessToken = tokenPort.createAccessToken(user);
        String refreshPlain = UUID.randomUUID().toString();
        String refreshHash = tokenPort.hash(refreshPlain);
        RefreshToken rt = RefreshToken.createNew(
                user.id(),
                refreshHash,
                Instant.now().plus(30, ChronoUnit.DAYS),
                "unknown-device");
        refreshRepo.save(rt);

        return new TokenResponse(
                accessToken.value(),
                refreshPlain,
                accessToken.expiresInSeconds()
        );
    }
    @Override
    @Transactional
    public TokenResponse refresh(RefreshRequest request) {
        String provided = request.refreshToken();
        Optional<RefreshToken> stored =
                refreshRepo.findByTokenHash(tokenPort.hash(provided));

        RefreshToken rt = stored.orElseThrow(() -> new RuntimeException("Refresh token inválido"));

        if (rt.expiresAt().isBefore(Instant.now()) || rt.revoked()) {
            throw new RuntimeException("Refresh token expirado ou revogado");
        }

        UsuarioAuthDto user = usuarioPort.findById(rt.userId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        AccessToken accessToken= tokenPort.createAccessToken(user);

        String newRefreshPlain = UUID.randomUUID().toString();
        String newRefreshHash = tokenPort.hash(newRefreshPlain);
        Instant newExpiry = Instant.now().plus(30, ChronoUnit.DAYS);

        rt.rotate(newRefreshHash, newExpiry);
        refreshRepo.save(rt);

        return new TokenResponse(accessToken.value(), newRefreshPlain, accessToken.expiresInSeconds());
    }
    @Override
    public void logout(String refreshTokenPlain) {
        String hash = tokenPort.hash(refreshTokenPlain);
        refreshRepo.revokeByHash(hash);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usuarioPort.findByEmail(username)
                .map(this::mapToUserDetails)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Usuário não encontrado com o email: " + username)
                );
    }

    private UserDetails mapToUserDetails(UsuarioAuthDto usuario) {
        return User.builder()
                .username(usuario.email())
                .password(usuario.senhaHash())
                .roles(usuario.roles().toArray(new String[0]))
                .build();
    }

    private String extractDeviceInfo(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        String ip = request.getRemoteAddr();
        return userAgent != null ? userAgent.substring(0, Math.min(100, userAgent.length())) : ip;
    }
}