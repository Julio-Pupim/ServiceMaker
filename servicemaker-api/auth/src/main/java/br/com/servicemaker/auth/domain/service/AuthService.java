package br.com.servicemaker.auth.domain.service;

import br.com.servicemaker.PasswordPort;
import br.com.servicemaker.auth.domain.model.AccessToken;
import br.com.servicemaker.auth.domain.model.RefreshToken;
import br.com.servicemaker.auth.domain.port_out.RefreshTokenRepository;
import br.com.servicemaker.auth.domain.port_out.TokenPort;
import br.com.servicemaker.auth.domain.port_out.UsuarioPort;
import br.com.servicemaker.authapi.api.AuthFacade;
import br.com.servicemaker.authapi.api.dto.LoginRequest;
import br.com.servicemaker.authapi.api.dto.RefreshRequest;
import br.com.servicemaker.authapi.api.dto.TokenResponse;
import br.com.servicemaker.usuarioapi.api.dto.UsuarioAuthDto;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService implements AuthFacade {

    private final UsuarioPort usuarioPort;
    private final PasswordPort passwordPort;
    private final TokenPort tokenPort;
    private final RefreshTokenRepository refreshRepo;

    public AuthService(UsuarioPort usuarioPort,
                       PasswordPort passwordPort,
                       TokenPort tokenPort,
                       RefreshTokenRepository refreshRepo) {
        this.usuarioPort = usuarioPort;
        this.passwordPort = passwordPort;
        this.tokenPort = tokenPort;
        this.refreshRepo = refreshRepo;
    }

    @Override
    public TokenResponse authenticate(LoginRequest request) {
        UsuarioAuthDto user = usuarioPort.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas"));

        if (!passwordPort.matches(request.password(), user.passwordHash())) {
            throw new RuntimeException("Credenciais inválidas");
        }

        AccessToken accessToken = tokenPort.createAccessToken(user);
        String refreshPlain = UUID.randomUUID().toString();
        String refreshHash = tokenPort.hash(refreshPlain);
        RefreshToken rt = RefreshToken.createNew(
                user.id(),
                refreshHash,
                Instant.now(),
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

        return new TokenResponse(accessToken.value(), provided, accessToken.expiresInSeconds());
    }
    @Override
    public void logout(String refreshTokenPlain) {
        String hash = tokenPort.hash(refreshTokenPlain);
        refreshRepo.revokeByHash(hash);
    }
}