package br.com.servicemaker.DTO;

import br.com.servicemaker.domain.Servico;
import br.com.servicemaker.domain.enums.Status;
import java.time.LocalTime;

public record ReservaDTO(String nomePrestador, String nomeCliente, Servico servico, Status status,
                         LocalTime horarioInicio, LocalTime horarioFim, Long id) {

}
