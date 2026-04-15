package br.com.serviceMaker.users.domain.vo;

import lombok.Getter;

import java.util.Objects;

@Getter
public class PasswordHash {

    private final String value;

    private PasswordHash(String value) {

        if (value == null || value.isBlank())
            throw new IllegalArgumentException("Password cannot be empty");

        this.value = value;
    }

    public static PasswordHash of(String value) {
        return new PasswordHash(value);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PasswordHash that)) return false;
        return value.equals(that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}