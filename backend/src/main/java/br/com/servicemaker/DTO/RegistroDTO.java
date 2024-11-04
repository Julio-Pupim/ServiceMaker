package br.com.servicemaker.DTO;

public record RegistroDTO(String nome, String cpf, String senha, EnderecoDTO endereco,
                          ContatoDTO contato, Boolean prestador) {


}
