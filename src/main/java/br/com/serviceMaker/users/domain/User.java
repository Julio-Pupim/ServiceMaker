package br.com.serviceMaker.users.domain;


import br.com.serviceMaker.shared.Cpf;
import br.com.serviceMaker.shared.Email;
import br.com.serviceMaker.shared.UserId;
import br.com.serviceMaker.shared.UserName;
import br.com.serviceMaker.users.domain.exceptions.InactiveUserException;
import br.com.serviceMaker.users.domain.vo.PasswordHash;
import lombok.Getter;

import java.time.Instant;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * Aggregate root representing a user of the serviceMaker platform.
 *
 * <p><strong>Invariants:</strong></p>
 * <ul>
 *   <li>Email, CPF, and name must be valid value objects (validated on creation).</li>
 *   <li>Password is always stored as a hash; plain-text passwords are never persisted.</li>
 *   <li>{@code active = true} is a precondition for mutation operations:
 *       {@link #createProviderProfile(String)} and {@link #changePassword(String)} both
 *       throw {@link InactiveUserException} when called on an inactive user.</li>
 *   <li>Deactivation is idempotent: calling {@link #deactivate()} on an already-inactive
 *       user is a no-op and does not throw.</li>
 *   <li>A provider profile is unique per user: once created it cannot be re-created
 *       (attempting to do so throws {@link IllegalStateException}).</li>
 * </ul>
 */
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

    private User(
            UserId id,
            Email email,
            Cpf cpf,
            PasswordHash passwordHash,
            UserName name,
            Instant createdAt,
            boolean active
    ) {
        this.id = id;
        this.email = email;
        this.cpf = cpf;
        this.passwordHash = passwordHash;
        this.name = name;
        this.createdAt = createdAt;
        this.active = active;
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

    public static User reconstitute(
            UserId id,
            Email email,
            Cpf cpf,
            PasswordHash passwordHash,
            UserName name,
            Instant createdAt,
            boolean active,
            Set<UserRole> roles,
            ClientProfile clientProfile,
            ProviderProfile providerProfile
    ) {
        User user = new User(id, email, cpf, passwordHash, name, createdAt, active);
        user.roles.addAll(roles);
        user.clientProfile = clientProfile;
        user.providerProfile = providerProfile;
        return user;
    }


    public void createProviderProfile(String description) {
        if (!active) throw new InactiveUserException("Cannot create provider profile for inactive user: " + id);
        if (providerProfile != null) throw new IllegalStateException("Provider profile already exists");

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
        if (!active) throw new InactiveUserException("Cannot change password for inactive user: " + id);
        this.passwordHash = PasswordHash.of(newPasswordHash);
    }

    public boolean hasProviderProfile() {
        return providerProfile != null;
    }

    public boolean hasClientProfile() {
        return clientProfile != null;
    }

    public boolean hasRole(UserRole role) {
        return roles.contains(role);
    }

    public Set<UserRole> getRoles() {
        return Collections.unmodifiableSet(roles);
    }

}
