package br.com.servicemaker;

public interface PasswordPort {

    boolean matches(String rawPassword, String encodedPassword);

    String encode(String rawPassword);
}
