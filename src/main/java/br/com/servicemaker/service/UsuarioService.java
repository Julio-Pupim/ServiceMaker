package br.com.servicemaker.service;


import br.com.servicemaker.AbstractCrud.AbstractService;
import br.com.servicemaker.domain.Usuario;
import br.com.servicemaker.repository.UsuarioRepository;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService extends AbstractService<Usuario, UsuarioRepository> {

    @Autowired
    public UsuarioService(UsuarioRepository repository, EntityManager em){
        super(repository, em);
    }


}


