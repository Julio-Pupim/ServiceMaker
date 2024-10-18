package br.com.servicemaker.DTO;

import br.com.servicemaker.domain.Contato;
import br.com.servicemaker.domain.enums.Roles;

public record RegistroDTO(Contato contato, String nome, String password, Roles role) {



}
