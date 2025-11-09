package br.com.servicemaker.authapi.api;

import br.com.servicemaker.authapi.api.dto.LoginRequest;
import br.com.servicemaker.authapi.api.dto.RefreshRequest;
import br.com.servicemaker.authapi.api.dto.TokenResponse;

public interface AuthFacade {
    TokenResponse authenticate(LoginRequest request);

    TokenResponse refresh(RefreshRequest request);

    void logout(String refreshToken);
}
