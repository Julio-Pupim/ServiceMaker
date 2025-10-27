package br.com.servicemaker.auth.api.dto;

public record TokenResponse(String accessToken, String refreshToken, long expiresInSeconds)  {
}
