package br.com.servicemaker.service;

import br.com.servicemaker.abstractcrud.AbstractService;
import br.com.servicemaker.domain.Prestador;
import br.com.servicemaker.repository.PrestadorRepository;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PrestadorService extends AbstractService<Prestador, PrestadorRepository> {

  @Autowired
  public PrestadorService(PrestadorRepository repository, EntityManager em) {
    super(repository, em);
  }

}
