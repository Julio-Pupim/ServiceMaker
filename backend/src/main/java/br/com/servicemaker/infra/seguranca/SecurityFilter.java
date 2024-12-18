package br.com.servicemaker.infra.seguranca;

import br.com.servicemaker.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@AllArgsConstructor
public class SecurityFilter extends OncePerRequestFilter {

  private final TokenService tokenService;
  private final UsuarioRepository usuarioRepository;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {

    var token = this.recoverToken(request);
    if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
      var login = tokenService.validaToken(token);
      UserDetails usuario = usuarioRepository.findByContatoEmail(login);

      var authentication = new UsernamePasswordAuthenticationToken(usuario, null,
          usuario.getAuthorities());
      authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
      SecurityContextHolder.getContext().setAuthentication(authentication);
    }
    filterChain.doFilter(request, response);
  }

  private String recoverToken(HttpServletRequest request) {
    var servMakerHeader = request.getHeader("Authorization");
    if (servMakerHeader == null) {
      return null;
    }
    return servMakerHeader.replace("Bearer ", "");
  }
}
