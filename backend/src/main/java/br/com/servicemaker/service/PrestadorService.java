package br.com.servicemaker.service;

import br.com.servicemaker.abstractcrud.AbstractService;
import br.com.servicemaker.domain.Prestador;
import br.com.servicemaker.repository.PrestadorRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PrestadorService extends AbstractService<Prestador, PrestadorRepository> {

  private final PrestadorRepository prestadorRepository;

  @Autowired
  public PrestadorService(PrestadorRepository repository, EntityManager em) {
    super(repository, em);
    this.prestadorRepository = repository;
  }

  public List<Prestador>findAllPrestadorBySetores(Long SetorId){
    return prestadorRepository.findBySetorId(SetorId);
  }

}
