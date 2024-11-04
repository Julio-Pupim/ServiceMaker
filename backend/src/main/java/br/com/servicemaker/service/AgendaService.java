package br.com.servicemaker.service;

import br.com.servicemaker.abstractcrud.AbstractService;
import br.com.servicemaker.domain.Agenda;
import br.com.servicemaker.domain.CronogramaTrabalho;
import br.com.servicemaker.domain.Reserva;
import br.com.servicemaker.repository.AgendaRepository;
import br.com.servicemaker.repository.PrestadorRepository;
import jakarta.persistence.EntityManager;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AgendaService extends AbstractService<Agenda, AgendaRepository> {

  private final AgendaRepository agendaRepository;

  @Autowired
  public AgendaService(AgendaRepository repository, EntityManager em,
      PrestadorRepository prestadorRepository) {
    super(repository, em);
    this.agendaRepository = repository;
  }

  public List<LocalDate> findAllDiasDisponiveis(Long idPrestador) {

    Agenda agenda = agendaRepository.findAgendaByPrestador(idPrestador);

  }

  private Set<Integer> getAllDiasCronograTrabalho(List<CronogramaTrabalho> cronogramas) {

    return cronogramas.stream().map(CronogramaTrabalho::getDiaSemana)
        .collect(Collectors.toSet());
  }

  private void verificarSeODiaEspecificoEstaCheio(LocalDate diaEspecifico, Agenda agenda) {

    DayOfWeek diaDaSemana = diaEspecifico.getDayOfWeek();

    List<Reserva> reservasEspecificas = agenda.getReservas().stream()
        .filter(reserva -> reserva.getReservadoEm().toLocalDate().equals(diaEspecifico)).toList();

    List<CronogramaTrabalho> cronogramaTrabalhos = agenda.getCronogramas().stream().filter(
            cronogramaTrabalho -> cronogramaTrabalho.getDiaSemana().equals(diaDaSemana.getValue()))
        .toList();
    
  }


}