package br.com.serviceMaker.users.infra.persistence;

import br.com.serviceMaker.shared.Cpf;
import br.com.serviceMaker.shared.Email;
import br.com.serviceMaker.shared.UserId;
import br.com.serviceMaker.shared.UserName;
import br.com.serviceMaker.users.domain.ClientProfile;
import br.com.serviceMaker.users.domain.ProviderProfile;
import br.com.serviceMaker.users.domain.User;
import br.com.serviceMaker.users.domain.UserRole;
import br.com.serviceMaker.users.domain.vo.PasswordHash;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

class UserEntityMapper {

    User mapAggregate(List<Map<String, Object>> rows) {
        if (rows == null || rows.isEmpty()) {
            return null;
        }

        Map<String, Object> first = rows.getFirst();

        UserId id = new UserId(toUuid(first.get("id")));
        Email email = Email.of((String) first.get("email"));
        Cpf cpf = Cpf.of((String) first.get("cpf"));
        PasswordHash passwordHash = PasswordHash.of((String) first.get("password_hash"));
        UserName name = UserName.of((String) first.get("name"));
        Instant createdAt = toInstant(first.get("created_at"));
        boolean active = (Boolean) first.get("active");

        Set<UserRole> roles = new HashSet<>();
        for (Map<String, Object> row : rows) {
            Object role = row.get("role");
            if (role != null) {
                roles.add(UserRole.valueOf(role.toString()));
            }
        }

        ClientProfile clientProfile = null;
        Object clientCreatedAt = first.get("client_created_at");
        if (clientCreatedAt != null) {
            clientProfile = ClientProfile.reconstitute(id, toInstant(clientCreatedAt));
        }

        ProviderProfile providerProfile = null;
        Object providerDescription = first.get("provider_description");
        if (providerDescription != null) {
            providerProfile = ProviderProfile.reconstitute(
                    id,
                    (String) providerDescription,
                    (BigDecimal) first.get("provider_rating"),
                    ((Number) first.get("provider_review_count")).longValue(),
                    toInstant(first.get("provider_created_at"))
            );
        }

        return User.reconstitute(id, email, cpf, passwordHash, name, createdAt, active, roles, clientProfile, providerProfile);
    }

    private UUID toUuid(Object value) {
        if (value instanceof UUID uuid) return uuid;
        if (value instanceof String s) return UUID.fromString(s);
        throw new IllegalStateException("Unsupported UUID type: " + value.getClass());
    }

    private Instant toInstant(Object value) {
        if (value == null) return null;
        if (value instanceof Timestamp ts) return ts.toInstant();
        if (value instanceof Instant i) return i;
        if (value instanceof LocalDateTime ldt) return ldt.toInstant(ZoneOffset.UTC);
        throw new IllegalStateException("Unsupported timestamp type: " + value.getClass());
    }
}
