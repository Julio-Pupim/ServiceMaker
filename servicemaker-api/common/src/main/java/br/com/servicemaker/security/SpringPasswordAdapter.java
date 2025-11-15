package br.com.servicemaker.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SpringPasswordAdapter implements PasswordPort {


    private final PasswordEncoder springEncoder;

    @Override
    public boolean matches(String rawPassword, String encodedPassword) {
        return springEncoder.matches(rawPassword, encodedPassword);
    }

    @Override
    public String encode(String rawPassword) {
        return springEncoder.encode(rawPassword);
    }
}
