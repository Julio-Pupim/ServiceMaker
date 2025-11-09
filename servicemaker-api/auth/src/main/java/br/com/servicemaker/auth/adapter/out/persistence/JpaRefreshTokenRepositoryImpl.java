package br.com.servicemaker.auth.adapter.out.persistence;

import br.com.servicemaker.auth.adapter.out.mapper.RefreshTokenMapper;
import br.com.servicemaker.auth.domain.model.RefreshToken;
import br.com.servicemaker.auth.domain.port_out.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import java.util.Objects;
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
        RefreshTokenEntity entity = RefreshTokenMapper.toEntity(token);
        jpa.save(Objects.requireNonNull(entity));
    }

    @Override
    public Optional<RefreshToken> findById(UUID id) {
        return jpa.findById(id).map(RefreshTokenMapper::toDomain);    }

    @Override
    public Optional<RefreshToken> findByTokenHash(String tokenHash) {
        return jpa.findByTokenHash(tokenHash).map(RefreshTokenMapper::toDomain);
    }

    @Override
    public void revokeByHash(String tokenHash) {
        jpa.findByTokenHash(tokenHash).ifPresent(entity -> {
            entity.setRevoked(true);
            jpa.save(entity);
        });
    }
}


