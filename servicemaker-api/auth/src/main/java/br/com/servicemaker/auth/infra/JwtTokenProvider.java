package br.com.servicemaker.auth.infra;

import br.com.servicemaker.auth.domain.model.AccessToken;
import br.com.servicemaker.auth.domain.port_out.TokenPort;
import br.com.servicemaker.usuarioapi.api.dto.UsuarioAuthDto;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenProvider implements TokenPort {

    private final long accessTokenValiditySeconds = 60 * 15;

    private SecretKey key() {
        String jwtSecret = "CHANGE_ME_PUT_REAL_SECRET";
        byte[] bytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        // usa HS256
        return new SecretKeySpec(bytes, SignatureAlgorithm.HS256.getJcaName());
    }

    public AccessToken createAccessToken(UsuarioAuthDto user) {
        Instant now = Instant.now();
        Date issued = Date.from(now);
        Date exp = Date.from(now.plusSeconds(accessTokenValiditySeconds));

        Claims claims = Jwts.claims()
                .add("email", user.email())
                .add("roles", user.roles())
                .subject(user.id().toString())
                .build();

        String tokenValue = Jwts.builder()
                .claims(claims)
                .issuedAt(issued)
                .expiration(exp)
                .signWith(key())
                .compact();

        return new AccessToken(tokenValue, this.accessTokenValiditySeconds);
    }

    public boolean validate(String token) {
        try {
            Jwts.parser().verifyWith(key()).build().parseSignedClaims(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public Claims parseClaims(String token) {
        return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload();
    }


    public long accessTokenValiditySeconds() {
        return accessTokenValiditySeconds;
    }

   @Override
    public String hash(String plain) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] dig = md.digest(plain.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(dig);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
