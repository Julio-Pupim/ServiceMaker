package br.com.servicemaker.service;

import br.com.servicemaker.abstractcrud.AbstractService;
import br.com.servicemaker.domain.Certificado;
import br.com.servicemaker.repository.CertificadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CertificadoService extends AbstractService<Certificado, CertificadoRepository> {

  @Autowired
  public CertificadoService(CertificadoRepository repository) {
    super(repository);
  }

}

