package br.com.servicemaker.auth.adapter.out.persistence;

import br.com.servicemaker.auth.domain.model.RefreshToken;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@Transactional
public class JpaRefreshTokenRepositoryImpl implements RefreshTokenRepository {

    private final RefreshTokenJpaRepository jpa;

    public JpaRefreshTokenRepositoryImpl(RefreshTokenJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public void save(RefreshToken token) {
        RefreshTokenEntity entity = toEntity(token);
        jpa.save(entity);
    }

    @Override
    public Optional<RefreshToken> findById(UUID id) {
        return jpa.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<RefreshToken> findByTokenHash(String tokenHash) {
        return jpa.findByTokenHash(tokenHash).map(this::toDomain);
    }

    @Override
    public void revokeByHash(String tokenHash) {
        jpa.findByTokenHash(tokenHash).ifPresent(entity -> {
            entity.setRevoked(true);
            jpa.save(entity);
        });
    }

        private RefreshToken toDomain(RefreshTokenEntity e) {
        return new RefreshToken(
                e.getId(),
                e.getUserId(),
                e.getTokenHash(),
                e.getIssuedAt(),
                e.getExpiresAt(),
                e.isRevoked(),
                e.getDeviceInfo()
        );
    }

    private RefreshTokenEntity toEntity(RefreshToken d) {
        return new RefreshTokenEntity(
                d.id(),
                d.userId(),
                d.tokenHash(),
                d.issuedAt(),
                d.expiresAt(),
                d.revoked(),
                d.deviceInfo()
        );
    }
}


