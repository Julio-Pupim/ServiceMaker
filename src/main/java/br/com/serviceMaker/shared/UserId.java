package br.com.serviceMaker.shared;

import java.util.UUID;

public record UserId (UUID value){


    public static UserId generate(){
        return new UserId(UUID.randomUUID());
    }

}
