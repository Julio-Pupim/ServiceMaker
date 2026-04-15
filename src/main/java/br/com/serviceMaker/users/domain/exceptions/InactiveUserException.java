package br.com.serviceMaker.users.domain.exceptions;

public class InactiveUserException extends RuntimeException {

    public InactiveUserException(String message) {
        super(message);
    }
}
