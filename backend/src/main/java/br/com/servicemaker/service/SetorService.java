package br.com.servicemaker.service;

import br.com.servicemaker.abstractcrud.AbstractService;
import br.com.servicemaker.domain.Setor;
import br.com.servicemaker.repository.SetorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SetorService extends AbstractService<Setor, SetorRepository> {

  @Autowired
  public SetorService(SetorRepository repository) {
    super(repository);
  }

}
