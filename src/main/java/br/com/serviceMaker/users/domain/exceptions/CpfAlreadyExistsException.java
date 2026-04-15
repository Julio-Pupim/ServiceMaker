package br.com.serviceMaker.users.domain.exceptions;

public class CpfAlreadyExistsException extends RuntimeException {

    public CpfAlreadyExistsException(String cpf) {
        super("CPF already in use: " + cpf);
    }
}
