package br.com.servicemaker.auth.domain.model;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public final class RefreshToken {

    private UUID id;
    private final UUID userId;
    private  String tokenHash;
    private  Instant issuedAt;
    private  Instant expiresAt;
    private boolean revoked;
    private final String deviceInfo;

    private RefreshToken(UUID id, UUID userId, String tokenHash, Instant issuedAt,
                         Instant expiresAt, boolean revoked, String deviceInfo) {
        this.id = id;
        this.userId = Objects.requireNonNull(userId, "userId required");
        this.tokenHash = Objects.requireNonNull(tokenHash, "tokenHash required");
        this.issuedAt = Objects.requireNonNull(issuedAt, "issuedAt required");
        this.expiresAt = Objects.requireNonNull(expiresAt, "expiresAt required");
        this.revoked = revoked;
        this.deviceInfo = deviceInfo;
    }


    public static RefreshToken createNew(UUID userId, String tokenHash, Instant expiresAt, String deviceInfo) {
        return new RefreshToken(UUID.randomUUID(), userId, tokenHash, Instant.now(), expiresAt, false, deviceInfo);
    }

    public static RefreshToken rehydrate(UUID id, UUID userId, String tokenHash, Instant issuedAt,
                                         Instant expiresAt, boolean revoked, String deviceInfo) {
        return new RefreshToken(id, userId, tokenHash, issuedAt, expiresAt, revoked, deviceInfo);
    }


    public void revoke() {
        this.revoked = true;
    }

    public boolean isExpired() {
        return Instant.now().isAfter(this.expiresAt);
    }

    public boolean isActive() {
        return !revoked && !isExpired();
    }

    public void rotate(String newTokenHash, Instant newExpiresAt) {
        if (newTokenHash == null || newTokenHash.isBlank()) {
            throw new IllegalArgumentException("newTokenHash must be provided");
        }
        if (newExpiresAt == null || newExpiresAt.isBefore(Instant.now())) {
            throw new IllegalArgumentException("newExpiresAt must be in the future");
        }
        this.tokenHash = newTokenHash;
        this.issuedAt = Instant.now();
        this.expiresAt = newExpiresAt;
        this.revoked = false;
    }

    public UUID id() {
        return id;
    }

    public UUID userId() {
        return userId;
    }

    public String tokenHash() {
        return tokenHash;
    }

    public Instant issuedAt() {
        return issuedAt;
    }

    public Instant expiresAt() {
        return expiresAt;
    }

    public boolean revoked() {
        return revoked;
    }

    public String deviceInfo() {
        return deviceInfo;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) return true;
        if (obj == null || obj.getClass() != this.getClass()) return false;
        var that = (RefreshToken) obj;

        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : getClass().hashCode();
    }

    @Override
    public String toString() {
        return "RefreshToken[" +
                "id=" + id + ", " +
                "userId=" + userId + ", " +
                "issuedAt=" + issuedAt + ", " +
                "expiresAt=" + expiresAt + ", " +
                "revoked=" + revoked + ", " +
                "deviceInfo=" + deviceInfo + ']';
    }
}