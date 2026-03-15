package br.com.serviceMaker.shared;

import java.util.Objects;

public class UserName {

    private final String value;

    private UserName(String value) {

        if (value == null || value.isBlank())
            throw new IllegalArgumentException("Name cannot be empty");

        if (value.length() < 2)
            throw new IllegalArgumentException("Name too short");

        this.value = value;
    }

    public static UserName of(String value) {
        return new UserName(value);
    }

    public String getValue() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserName userName)) return false;
        return value.equals(userName.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}