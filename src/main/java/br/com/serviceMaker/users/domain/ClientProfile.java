package br.com.serviceMaker.users.domain;

import br.com.serviceMaker.shared.UserId;

import java.time.Instant;

public class ClientProfile {
    private final UserId userId;
    private final Instant createdAt;

    public ClientProfile(UserId userId) {
        this.userId = userId;
        createdAt = Instant.now();
    }

    public static ClientProfile reconstitute(UserId userId, Instant createdAt) {
        return new ClientProfile(userId, createdAt);
    }

    private ClientProfile(UserId userId, Instant createdAt) {
        this.userId = userId;
        this.createdAt = createdAt;
    }
}
