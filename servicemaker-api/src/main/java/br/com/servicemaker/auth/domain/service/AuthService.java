package br.com.servicemaker.auth.domain.service;

import br.com.servicemaker.auth.api.AuthFacade;
import br.com.servicemaker.auth.domain.port_out.RefreshTokenRepository;
import br.com.servicemaker.auth.api.dto.LoginRequest;
import br.com.servicemaker.auth.api.dto.RefreshRequest;
import br.com.servicemaker.auth.api.dto.TokenResponse;
import br.com.servicemaker.auth.domain.model.RefreshToken;
import br.com.servicemaker.auth.domain.port_out.TokenPort;
import br.com.servicemaker.auth.domain.port_out.UsuarioPort;
import br.com.servicemaker.auth.infra.JwtTokenProvider;
import br.com.servicemaker.usuarios.api.dto.UsuarioAuthDto;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService implements AuthFacade {

    private final UsuarioPort usuarioPort;
    private final PasswordEncoder passwordEncoder;
    private final TokenPort tokenPort;
    private final RefreshTokenRepository refreshRepo;

    public AuthService(UsuarioPort usuarioPort,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       RefreshTokenRepository refreshRepo) {
        this.usuarioPort = usuarioPort;
        this.passwordEncoder = passwordEncoder;
        this.tokenPort = tokenProvider;
        this.refreshRepo = refreshRepo;
    }

    @Override
    public TokenResponse authenticate(LoginRequest request) {
        UsuarioAuthDto user = usuarioPort.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas"));

        if (!passwordEncoder.matches(request.password(), user.passwordHash())) {
            throw new RuntimeException("Credenciais inválidas");
        }

        TokenPort.AccessToken accessToken = tokenPort.createAccessToken(user);
        String refreshPlain = UUID.randomUUID().toString();
        String refreshHash = tokenPort.hash(refreshPlain);
        RefreshToken rt = new RefreshToken(
                UUID.randomUUID(),
                user.id(),
                refreshHash,
                Instant.now(),
                Instant.now().plus(30, ChronoUnit.DAYS),
                false,
                "unknown-device"
        );
        refreshRepo.save(rt);

        return new TokenResponse(
                accessToken.value(),
                refreshPlain,
                accessToken.expiresInSeconds()
        );
    }
    @Override
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

        TokenPort.AccessToken accessToken= tokenPort.createAccessToken(user);

         // Opcional: rotação de refresh token — aqui só devolvemos o mesmo refresh
        return new TokenResponse(accessToken.value(), provided, accessToken.expiresInSeconds());
    }
    @Override
    public void logout(String refreshTokenPlain) {
        String hash = tokenPort.hash(refreshTokenPlain);
        refreshRepo.revokeByHash(hash);
    }
}