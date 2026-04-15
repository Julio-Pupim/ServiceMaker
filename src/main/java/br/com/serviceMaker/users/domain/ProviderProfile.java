package br.com.serviceMaker.users.domain;

import br.com.serviceMaker.shared.UserId;

import java.math.BigDecimal;
import java.time.Instant;

public class ProviderProfile {
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

    public static ProviderProfile reconstitute(UserId userId, String description, BigDecimal rating, Long reviewCount, Instant createdAt) {
        ProviderProfile p = new ProviderProfile(userId, description);
        p.rating = rating;
        p.reviewCount = reviewCount;
        p.createdAt = createdAt;
        return p;
    }

    public UserId getUserId() {
        return userId;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public Long getReviewCount() {
        return reviewCount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

}
