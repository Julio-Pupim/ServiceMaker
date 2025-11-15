package br.com.servicemaker.security;

public interface PasswordPort {

    boolean matches(String rawPassword, String encodedPassword);

    String encode(String rawPassword);
}
