package br.com.serviceMaker.shared;

import java.util.Objects;

public class Cpf {

    private final String value;

    private Cpf(String value) {

        if (value == null || value.isBlank())
            throw new IllegalArgumentException("CPF cannot be empty");

        if (value.length() != 11)
            throw new IllegalArgumentException("CPF must have 11 digits");

        this.value = value;
    }

    public static Cpf of(String value) {
        return new Cpf(value);
    }

    public String getValue() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Cpf cpf)) return false;
        return value.equals(cpf.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}