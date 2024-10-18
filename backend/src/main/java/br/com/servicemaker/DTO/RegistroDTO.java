package br.com.servicemaker.DTO;

public record RegistroDTO(String nome, String cpf, String senha, EnderecoDTO enderecoDTO,
                          ContatoDTO contato, Boolean prestador) {


}
