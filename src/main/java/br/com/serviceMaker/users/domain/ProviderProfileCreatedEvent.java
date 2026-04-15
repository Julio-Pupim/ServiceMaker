package br.com.serviceMaker.users.domain;

import java.time.Instant;
import java.util.UUID;

public record ProviderProfileCreatedEvent(UUID userId, String description, Instant timestamp) {}
