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
}
