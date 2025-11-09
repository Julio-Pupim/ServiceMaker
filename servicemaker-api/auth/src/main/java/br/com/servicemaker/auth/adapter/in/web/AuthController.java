package br.com.servicemaker.auth.adapter.in.web;


import br.com.servicemaker.authapi.api.AuthFacade;
import br.com.servicemaker.authapi.api.dto.LoginRequest;
import br.com.servicemaker.authapi.api.dto.RefreshRequest;
import br.com.servicemaker.authapi.api.dto.TokenResponse;
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
        private final AuthFacade authFacade;

        @PostMapping("/login")
        public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request) {
                TokenResponse tokens = authFacade.authenticate(request);
                return ResponseEntity.ok(tokens);
        }

        @PostMapping("/refresh")
        public ResponseEntity<TokenResponse> refresh(@RequestBody RefreshRequest request) {
                TokenResponse tokens = authFacade.refresh(request);
                return ResponseEntity.ok(tokens);
        }

        @PostMapping("/logout")
        public ResponseEntity<Void> logout(@RequestBody RefreshRequest request) {
                authFacade.logout(request.refreshToken());
                return ResponseEntity.noContent().build();
        }
        @PostMapping("/esqueci-senha")
        public void trocarSenha(){}

}
