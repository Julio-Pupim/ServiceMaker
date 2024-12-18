package br.com.servicemaker.service;

import br.com.servicemaker.abstractcrud.AbstractService;
import br.com.servicemaker.domain.Contato;
import br.com.servicemaker.repository.ContatoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContatoService extends AbstractService<Contato, ContatoRepository> {

  @Autowired
  public ContatoService(ContatoRepository repository) {
    super(repository);
  }

}
