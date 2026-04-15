package br.com.serviceMaker.users.domain.exceptions;

import br.com.serviceMaker.shared.UserId;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(UserId id) {
        super("User not found with id: " + id.value());
    }
}
