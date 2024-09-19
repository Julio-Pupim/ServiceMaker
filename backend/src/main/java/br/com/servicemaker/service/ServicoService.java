package br.com.servicemaker.service;

import br.com.servicemaker.abstractcrud.AbstractService;
import br.com.servicemaker.domain.Servico;
import br.com.servicemaker.repository.ServicoRepository;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ServicoService extends AbstractService<Servico, ServicoRepository> {

  @Autowired
  public ServicoService(ServicoRepository repository, EntityManager em) {
    super(repository, em);
  }

}
