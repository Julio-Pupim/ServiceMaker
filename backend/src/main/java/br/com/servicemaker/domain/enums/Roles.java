package br.com.servicemaker.domain.enums;

import lombok.Getter;

@Getter
public enum Roles {

  ROLE_PRESTADOR("ROLE_PRESTADOR"),
  ROLE_CLIENTE("ROLE_CLIENTE");

  private final String role;

  Roles(String role) {
    this.role = role;

  }


}
