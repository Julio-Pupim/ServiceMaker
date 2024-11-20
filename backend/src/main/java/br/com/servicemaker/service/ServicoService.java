package br.com.servicemaker.service;

import br.com.servicemaker.abstractcrud.AbstractService;
import br.com.servicemaker.domain.Servico;
import br.com.servicemaker.repository.ServicoRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ServicoService extends AbstractService<Servico, ServicoRepository> {

  private final ServicoRepository servicoRepository;

  @Autowired
  public ServicoService(ServicoRepository repository, EntityManager em) {
    super(repository, em);
    this.servicoRepository = repository;
  }

  public List<Servico> findAllServicosPorPrestador(Long idPrestador) {
    return servicoRepository.findAllServicosPorPrestador(idPrestador);
  }
}
