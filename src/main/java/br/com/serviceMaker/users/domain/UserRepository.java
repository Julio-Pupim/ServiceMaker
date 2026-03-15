package br.com.serviceMaker.users.domain;

import br.com.serviceMaker.shared.Cpf;
import br.com.serviceMaker.shared.Email;
import br.com.serviceMaker.shared.UserId;

import java.util.Optional;

public interface UserRepository {
    Optional<User> findById(UserId id);

    Optional<User> findByEmail(Email email);

    Optional<User> findByCpf(Cpf cpf);

    User save(User user);
}
