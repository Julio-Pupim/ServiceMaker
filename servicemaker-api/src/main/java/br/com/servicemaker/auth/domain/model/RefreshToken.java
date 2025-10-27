package br.com.servicemaker.auth.domain.model;

import java.time.Instant;
import java.util.UUID;

public record RefreshToken(
        UUID id,
        UUID userId,
        String tokenHash,
        Instant issuedAt,
        Instant expiresAt,
        boolean revoked,
        String deviceInfo
) { }