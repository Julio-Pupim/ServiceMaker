package br.com.servicemaker.service;

import br.com.servicemaker.AbstractCrud.AbstractService;
import br.com.servicemaker.domain.Contato;
import br.com.servicemaker.repository.ContatoRepository;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContatoService extends AbstractService<Contato, ContatoRepository> {

    @Autowired
    public ContatoService(ContatoRepository repository, EntityManager em){
        super(repository, em);
    }

}
