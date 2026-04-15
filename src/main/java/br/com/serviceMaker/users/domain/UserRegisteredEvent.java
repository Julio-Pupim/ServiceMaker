package br.com.serviceMaker.users.domain;

import java.time.Instant;
import java.util.UUID;

public record UserRegisteredEvent(UUID userId, String email, String name, Instant timestamp) {}
