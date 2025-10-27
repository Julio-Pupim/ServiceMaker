package br.com.servicemaker.auth.api;

import br.com.servicemaker.auth.api.dto.LoginRequest;
import br.com.servicemaker.auth.api.dto.RefreshRequest;
import br.com.servicemaker.auth.api.dto.TokenResponse;

public interface AuthFacade {
    TokenResponse authenticate(LoginRequest request);
    TokenResponse refresh(RefreshRequest request);
    void logout(String refreshToken);
}
