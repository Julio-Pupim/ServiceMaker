package br.com.servicemaker.domain.enums;

public enum Roles {

    Prestador("prestador"),
    Cliente("cliente");

    private final String role;

    Roles(String role){
        this.role = role;

    }

    public String getRole() {
        return role;
    }


}
