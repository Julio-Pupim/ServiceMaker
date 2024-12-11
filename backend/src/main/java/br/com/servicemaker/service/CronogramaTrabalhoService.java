package br.com.servicemaker.service;

import br.com.servicemaker.abstractcrud.AbstractService;
import br.com.servicemaker.domain.CronogramaTrabalho;
import br.com.servicemaker.repository.CronogramaTrabalhoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CronogramaTrabalhoService extends
    AbstractService<CronogramaTrabalho, CronogramaTrabalhoRepository> {

  @Autowired
  public CronogramaTrabalhoService(CronogramaTrabalhoRepository repository) {
    super(repository);
  }

}
