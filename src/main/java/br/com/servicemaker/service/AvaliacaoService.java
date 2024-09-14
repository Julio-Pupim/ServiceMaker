package br.com.servicemaker.service;

import br.com.servicemaker.AbstractCrud.AbstractService;
import br.com.servicemaker.domain.Avaliacao;
import br.com.servicemaker.repository.AvaliacaoRepository;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AvaliacaoService extends AbstractService<Avaliacao, AvaliacaoRepository> {

  @Autowired
  public AvaliacaoService(AvaliacaoRepository repository, EntityManager em){
    super(repository, em);
  }

}