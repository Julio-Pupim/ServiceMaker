package br.com.serviceMaker.users.domain;

import br.com.serviceMaker.shared.UserId;

import java.math.BigDecimal;
import java.time.Instant;

class ProviderProfile {
    UserId userId;
    String description;
    BigDecimal rating;
    Long reviewCount;
    Instant createdAt;

    public ProviderProfile(UserId id, String description) {
        this.userId = id;
        this.description = description;
        rating = BigDecimal.ZERO;
        reviewCount = 0L;
        createdAt = Instant.now();
    }

}
