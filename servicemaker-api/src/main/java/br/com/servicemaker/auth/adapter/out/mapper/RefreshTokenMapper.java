package br.com.servicemaker.auth.adapter.out.mapper;

import br.com.servicemaker.auth.adapter.out.persistence.RefreshTokenEntity;
import br.com.servicemaker.auth.domain.model.RefreshToken;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;

public final class RefreshTokenMapper {

    private RefreshTokenMapper(){}

    public static RefreshToken toDomain(RefreshTokenEntity entity){
        if(isNull(entity)) return null;
        return RefreshToken.rehydrate(entity.getId(),
                entity.getUserId(),
                entity.getTokenHash(),
                entity.getIssuedAt(),
                entity.getExpiresAt(),
                entity.isRevoked(),
                entity.getDeviceInfo());
    }

    public static RefreshTokenEntity toEntity(RefreshToken domain){
        if(isNull(domain)) return null;
        return new RefreshTokenEntity(
                domain.userId(),
                domain.userId(),
                domain.tokenHash(),
                domain.issuedAt(),
                domain.expiresAt(),
                domain.isExpired(),
                domain.deviceInfo());
    }

    public static List<RefreshToken> toDomainList(List<RefreshTokenEntity> list) {
        if (list == null) return null;
        return list.stream().filter(Objects::nonNull).map(RefreshTokenMapper::toDomain).collect(Collectors.toList());
    }

    public static List<RefreshTokenEntity> toEntityList(List<RefreshToken> list) {
        if (list == null) return null;
        return list.stream().filter(Objects::nonNull).map(RefreshTokenMapper::toEntity).collect(Collectors.toList());
    }
}
