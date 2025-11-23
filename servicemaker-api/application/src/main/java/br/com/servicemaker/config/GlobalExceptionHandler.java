package br.com.servicemaker.config;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;


@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {


    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record ApiErrorResponse(
            Instant timestamp,
            int status,
            String error,
            String message,
            String path,
            Map<String, String> validationErrors
    ) {
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex, HttpServletRequest request
    ) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        log.warn("Falha na validação em {}: {}", request.getRequestURI(), errors);

        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                "Falha na validação. Verifique os campos.",
                request.getRequestURI(),
                errors
        );

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthenticationException(
            AuthenticationException ex, HttpServletRequest request
    ) {
        log.warn("Falha na autenticação (401) em {}: {}", request.getRequestURI(), ex.getMessage());
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                HttpStatus.UNAUTHORIZED.value(),
                "Unauthorized",
                "Credenciais inválidas ou token expirado.",
                request.getRequestURI(),
                null
        );
        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDenied(
            AccessDeniedException ex, HttpServletRequest request
    ) {
        log.warn("Acesso negado (403) em {}: {}", request.getRequestURI(), ex.getMessage());
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                HttpStatus.FORBIDDEN.value(),
                "Forbidden",
                "Não tem permissão para aceder a este recurso.",
                request.getRequestURI(),
                null
        );
        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(
            UsernameNotFoundException ex, HttpServletRequest request
    ) {
        log.warn("Recurso não encontrado (404) em {}: {}", request.getRequestURI(), ex.getMessage());
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                ex.getMessage(), // Mensagem segura (ex: "Utilizador não encontrado")
                request.getRequestURI(),
                null
        );
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(
            Exception ex, HttpServletRequest request
    ) {
        log.error("Erro inesperado (500) em {}: {}", request.getRequestURI(), ex.getMessage(), ex);

        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "Ocorreu um erro inesperado no servidor.", // Mensagem genérica para o utilizador
                request.getRequestURI(),
                null
        );
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}