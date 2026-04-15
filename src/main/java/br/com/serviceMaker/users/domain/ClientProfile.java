package br.com.serviceMaker.users.domain;

import br.com.serviceMaker.shared.UserId;

import java.time.Instant;

class ClientProfile {
    private final UserId userId;
    private final Instant createdAt;

    public ClientProfile(UserId userId) {
        this.userId = userId;
        createdAt = Instant.now();
    }

    static ClientProfile reconstitute(UserId userId, Instant createdAt) {
        return new ClientProfile(userId, createdAt);
    }

    private ClientProfile(UserId userId, Instant createdAt) {
        this.userId = userId;
        this.createdAt = createdAt;
    }
}
