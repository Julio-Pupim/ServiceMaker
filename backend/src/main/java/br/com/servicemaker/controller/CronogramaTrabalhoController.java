package br.com.servicemaker.controller;

import br.com.servicemaker.abstractcrud.AbstractController;
import br.com.servicemaker.domain.CronogramaTrabalho;
import br.com.servicemaker.repository.CronogramaTrabalhoRepository;
import br.com.servicemaker.service.CronogramaTrabalhoService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/cronogramas-trabalhos")
public class CronogramaTrabalhoController extends AbstractController<CronogramaTrabalho, CronogramaTrabalhoRepository, CronogramaTrabalhoService> {

  public CronogramaTrabalhoController(CronogramaTrabalhoService service){
      super(service);

  }

}
