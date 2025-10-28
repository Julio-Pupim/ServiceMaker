package br.com.servicemaker.auth.domain.port_out;

public interface PasswordPort {

    boolean matches(CharSequence rawPassword, String encodedPassword);
}
