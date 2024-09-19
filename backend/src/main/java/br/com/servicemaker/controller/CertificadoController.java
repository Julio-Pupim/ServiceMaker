package br.com.servicemaker.controller;


import br.com.servicemaker.abstractcrud.AbstractController;
import br.com.servicemaker.domain.Certificado;
import br.com.servicemaker.repository.CertificadoRepository;
import br.com.servicemaker.service.CertificadoService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ceritificado")
public class CertificadoController extends AbstractController<Certificado, CertificadoRepository, CertificadoService> {

  public CertificadoController(CertificadoService service) {
    super(service);
  }

}
