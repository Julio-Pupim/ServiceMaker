package br.com.servicemaker.DTO;

import br.com.servicemaker.domain.Usuario;

public record LoginResponseDTO(String token, Usuario usuario) {


}
