package br.com.servicemaker.DTO;

import br.com.servicemaker.domain.enums.Roles;

public record RegistroDTO(String login, String Password, Roles role) {



}
