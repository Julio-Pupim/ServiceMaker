package br.com.serviceMaker.users.domain;


import br.com.serviceMaker.shared.Cpf;
import br.com.serviceMaker.shared.Email;
import br.com.serviceMaker.shared.UserId;
import br.com.serviceMaker.shared.UserName;
import br.com.serviceMaker.users.domain.vo.PasswordHash;
import lombok.Getter;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Getter
public class User {

    private final UserId id;
    private Email email;
    private Cpf cpf;
    private PasswordHash passwordHash;
    private UserName name;
    private final Instant createdAt;

    private boolean active;

    private final Set<UserRole> roles = new HashSet<>();

    private ProviderProfile providerProfile;
    private ClientProfile clientProfile;

    private User(
            UserId id,
            Email email,
            Cpf cpf,
            PasswordHash passwordHash,
            UserName name,
            Instant createdAt
    ) {
        this.id = id;
        this.email = email;
        this.cpf = cpf;
        this.passwordHash = passwordHash;
        this.name = name;
        this.createdAt = createdAt;

        this.active = true;
    }


    public static User registerUser(
            String email,
            String cpf,
            String passwordHash,
            String name
    ) {

        User user = new User(
                UserId.generate(),
                Email.of(email),
                Cpf.of(cpf),
                PasswordHash.of(passwordHash),
                UserName.of(name),
                Instant.now()
        );

        user.roles.add(UserRole.CLIENT);
        user.clientProfile = new ClientProfile(user.id);

        return user;
    }


    public void createProviderProfile(String description) {

        if (providerProfile != null)
            throw new IllegalStateException("Provider profile already exists");

        providerProfile = new ProviderProfile(id, description);

        roles.add(UserRole.PROVIDER);
    }

    public void deactivate() {
        this.active = false;
    }

    public void activate() {
        this.active = true;
    }

    public void changePassword(String newPasswordHash) {

        this.passwordHash = PasswordHash.of(newPasswordHash);
    }



}
