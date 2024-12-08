package br.com.servicemaker.DTO;

import br.com.servicemaker.domain.Agenda;
import br.com.servicemaker.domain.Servico;
import br.com.servicemaker.domain.Usuario;
import br.com.servicemaker.domain.enums.Status;

import java.time.LocalDateTime;
import java.time.LocalTime;

public record ReservaDTO(Usuario cliente, Agenda agenda, Servico servico, Status status, LocalTime horarioInicio, LocalTime horarioFim, LocalDateTime reservadoEm) {
}
