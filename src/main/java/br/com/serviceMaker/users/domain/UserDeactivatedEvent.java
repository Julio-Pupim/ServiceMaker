package br.com.serviceMaker.users.domain;

import java.time.Instant;
import java.util.UUID;

public record UserDeactivatedEvent(UUID userId, Instant timestamp) {}
