package br.com.servicemaker.infra.seguranca;

import br.com.servicemaker.domain.Usuario;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

@Service
public class TokenService {

  @Value("${api.security.token.secret}")
  private String secret;

  public String gerarToken(Usuario usuario) {

    List<String> roles = usuario.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .toList();
    
    try {
      Algorithm algorithm = Algorithm.HMAC256(secret);
      return JWT.create()
          .withIssuer("serviceMaker-api")
          .withSubject(usuario.getContato().getEmail())
          .withClaim("roles", roles)
          .withExpiresAt(genDataVencimento())
          .sign(algorithm);
    } catch (JWTCreationException e) {
      throw new RuntimeException("Erro na geração do token ", e);
    }
  }

  public String validaToken(String token) {
    try {
      Algorithm algorithm = Algorithm.HMAC256(secret);
      return JWT.require(algorithm)
          .withIssuer("serviceMaker-api")
          .build()
          .verify(token)
          .getSubject();
    } catch (JWTVerificationException e) {
      throw new RuntimeException("Token inválido ", e);
    }

  }

  private Instant genDataVencimento() {
    return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
  }

}
