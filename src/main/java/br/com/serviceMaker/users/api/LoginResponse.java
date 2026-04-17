package br.com.serviceMaker.users.api;

public record LoginResponse(String accessToken, long expiresInSeconds) {}
