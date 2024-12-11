package br.com.servicemaker.service;

import br.com.servicemaker.abstractcrud.AbstractService;
import br.com.servicemaker.domain.Agenda;
import br.com.servicemaker.repository.AgendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AgendaService extends AbstractService<Agenda, AgendaRepository> {

  @Autowired
  public AgendaService(AgendaRepository repository) {
    super(repository);
  }

}