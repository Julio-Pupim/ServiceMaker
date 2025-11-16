package br.com.servicemaker.usuarioapi.api.dto;

import java.util.List;
import java.util.UUID;

public record UsuarioResponseDto (UUID id,
                                  String nome,
                                  String email,
                                  Boolean ativo,
                                  List<String> roles){
}
