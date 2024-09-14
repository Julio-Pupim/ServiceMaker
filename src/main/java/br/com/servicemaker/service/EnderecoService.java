package br.com.servicemaker.service;

import br.com.servicemaker.AbstractCrud.AbstractService;
import br.com.servicemaker.domain.Endereco;
import br.com.servicemaker.repository.EnderecoRepository;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EnderecoService extends AbstractService<Endereco, EnderecoRepository> {

    @Autowired
    public EnderecoService(EnderecoRepository repository, EntityManager em){
        super(repository, em);
    }

}
