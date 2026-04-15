package br.com.serviceMaker.users.infra.persistence;

import br.com.serviceMaker.shared.Cpf;
import br.com.serviceMaker.shared.Email;
import br.com.serviceMaker.shared.UserId;
import br.com.serviceMaker.users.domain.User;
import br.com.serviceMaker.users.domain.UserRepository;
import br.com.serviceMaker.users.domain.UserRole;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class JdbcUserRepository implements UserRepository {

    private static final String SELECT_USER_BY_CONDITION = """
            SELECT
                u.id,
                u.email,
                u.cpf,
                u.password_hash,
                u.name,
                u.created_at,
                u.active,
                r.role,
                cp.created_at  AS client_created_at,
                pp.description AS provider_description,
                pp.rating      AS provider_rating,
                pp.review_count AS provider_review_count,
                pp.created_at  AS provider_created_at
            FROM users.users u
            LEFT JOIN users.user_roles r        ON r.user_id = u.id
            LEFT JOIN users.client_profiles cp  ON cp.user_id = u.id
            LEFT JOIN users.provider_profiles pp ON pp.user_id = u.id
            WHERE %s
            """;

    private final NamedParameterJdbcTemplate jdbc;
    private final UserEntityMapper mapper;

    public JdbcUserRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
        this.mapper = new UserEntityMapper();
    }

    @Override
    public Optional<User> findById(UserId id) {
        String sql = String.format(SELECT_USER_BY_CONDITION, "u.id = :id");
        MapSqlParameterSource params = new MapSqlParameterSource("id", id.value());
        List<Map<String, Object>> rows = jdbc.queryForList(sql, params);
        return Optional.ofNullable(mapper.mapAggregate(rows));
    }

    @Override
    public Optional<User> findByEmail(Email email) {
        String sql = String.format(SELECT_USER_BY_CONDITION, "u.email = :email");
        MapSqlParameterSource params = new MapSqlParameterSource("email", email.getValue());
        List<Map<String, Object>> rows = jdbc.queryForList(sql, params);
        return Optional.ofNullable(mapper.mapAggregate(rows));
    }

    @Override
    public Optional<User> findByCpf(Cpf cpf) {
        String sql = String.format(SELECT_USER_BY_CONDITION, "u.cpf = :cpf");
        MapSqlParameterSource params = new MapSqlParameterSource("cpf", cpf.getValue());
        List<Map<String, Object>> rows = jdbc.queryForList(sql, params);
        return Optional.ofNullable(mapper.mapAggregate(rows));
    }

    @Override
    @Transactional
    public User save(User user) {
        boolean exists = existsById(user.getId());

        if (exists) {
            updateUser(user);
        } else {
            insertUser(user);
        }

        syncRoles(user);
        syncClientProfile(user);
        syncProviderProfile(user);

        return user;
    }

    private boolean existsById(UserId id) {
        String sql = "SELECT COUNT(*) FROM users.users WHERE id = :id";
        MapSqlParameterSource params = new MapSqlParameterSource("id", id.value());
        Integer count = jdbc.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    private void insertUser(User user) {
        String sql = """
                INSERT INTO users.users (id, email, cpf, password_hash, name, created_at, active)
                VALUES (:id, :email, :cpf, :passwordHash, :name, :createdAt, :active)
                """;
        jdbc.update(sql, userParams(user));
    }

    private void updateUser(User user) {
        String sql = """
                UPDATE users.users
                SET email = :email,
                    cpf = :cpf,
                    password_hash = :passwordHash,
                    name = :name,
                    active = :active
                WHERE id = :id
                """;
        jdbc.update(sql, userParams(user));
    }

    private MapSqlParameterSource userParams(User user) {
        return new MapSqlParameterSource()
                .addValue("id", user.getId().value())
                .addValue("email", user.getEmail().getValue())
                .addValue("cpf", user.getCpf().getValue())
                .addValue("passwordHash", user.getPasswordHash().getValue())
                .addValue("name", user.getName().getValue())
                .addValue("createdAt", Timestamp.from(user.getCreatedAt()))
                .addValue("active", user.isActive());
    }

    private void syncRoles(User user) {
        String deleteSql = "DELETE FROM users.user_roles WHERE user_id = :userId";
        MapSqlParameterSource deleteParams = new MapSqlParameterSource("userId", user.getId().value());
        jdbc.update(deleteSql, deleteParams);

        String insertSql = "INSERT INTO users.user_roles (user_id, role) VALUES (:userId, :role)";
        for (UserRole role : user.getRoles()) {
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("userId", user.getId().value())
                    .addValue("role", role.name());
            jdbc.update(insertSql, params);
        }
    }

    private void syncClientProfile(User user) {
        if (!user.hasClientProfile()) {
            return;
        }

        String sql = """
                INSERT INTO users.client_profiles (user_id, created_at)
                VALUES (:userId, :createdAt)
                ON CONFLICT (user_id) DO NOTHING
                """;
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("userId", user.getClientProfile().getUserId().value())
                .addValue("createdAt", Timestamp.from(user.getClientProfile().getCreatedAt()));
        jdbc.update(sql, params);
    }

    private void syncProviderProfile(User user) {
        if (!user.hasProviderProfile()) {
            return;
        }

        String sql = """
                INSERT INTO users.provider_profiles (user_id, description, rating, review_count, created_at)
                VALUES (:userId, :description, :rating, :reviewCount, :createdAt)
                ON CONFLICT (user_id) DO UPDATE SET
                    description  = EXCLUDED.description,
                    rating       = EXCLUDED.rating,
                    review_count = EXCLUDED.review_count
                """;
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("userId", user.getProviderProfile().getUserId().value())
                .addValue("description", user.getProviderProfile().getDescription())
                .addValue("rating", user.getProviderProfile().getRating())
                .addValue("reviewCount", user.getProviderProfile().getReviewCount())
                .addValue("createdAt", Timestamp.from(user.getProviderProfile().getCreatedAt()));
        jdbc.update(sql, params);
    }
}
