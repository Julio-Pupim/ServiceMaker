package br.com.servicemaker.authapi.api.dto;

public record TokenResponse(String accessToken, String refreshToken, long expiresInSeconds)  {
}
