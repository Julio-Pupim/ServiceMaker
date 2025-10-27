package br.com.servicemaker.auth.adapter.out.persistence;

import br.com.servicemaker.auth.domain.model.RefreshToken;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository {
    void save(RefreshToken token);
    Optional<RefreshToken> findById(UUID id);
    Optional<RefreshToken> findByTokenHash(String tokenHash);
    void revokeByHash(String tokenHash);
}
