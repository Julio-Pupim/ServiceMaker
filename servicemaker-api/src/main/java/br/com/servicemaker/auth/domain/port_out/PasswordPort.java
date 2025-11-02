package br.com.servicemaker.auth.domain.port_out;

public interface PasswordPort {

    boolean matches(String rawPassword, String encodedPassword);

    String encode(String rawPassword);
}
