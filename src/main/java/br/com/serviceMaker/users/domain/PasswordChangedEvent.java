package br.com.serviceMaker.users.domain;

import java.time.Instant;
import java.util.UUID;

public record PasswordChangedEvent(UUID userId, Instant timestamp) {}
