package br.com.servicemaker.domain.enums;

import lombok.Getter;

@Getter
public enum Roles {

  PRESTADOR("PRESTADOR"),
  CLIENTE("CLIENTE");

  private final String role;

  Roles(String role) {
    this.role = role;

  }


}
