package br.com.servicemaker.auth.adapter.in.web;

import br.com.servicemaker.auth.api.dto.LoginRequest;
import br.com.servicemaker.auth.api.dto.RefreshRequest;
import br.com.servicemaker.auth.api.dto.TokenResponse;
import br.com.servicemaker.auth.domain.service.AuthService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Data
@RequestMapping("/auth")
public class AuthController {
        private final AuthService svc;

        @PostMapping("/login")
        public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request) {
                TokenResponse tokens = svc.authenticate(request);
                return ResponseEntity.ok(tokens);
        }

        @PostMapping("/refresh")
        public ResponseEntity<TokenResponse> refresh(@RequestBody RefreshRequest request) {
                TokenResponse tokens = svc.refresh(request);
                return ResponseEntity.ok(tokens);
        }

        @PostMapping("/logout")
        public ResponseEntity<Void> logout(@RequestBody RefreshRequest request) {
                svc.logout(request.refreshToken());
                return ResponseEntity.noContent().build();
        }
        @PostMapping("/esqueci-senha")
        public void trocarSenha(){}

}
