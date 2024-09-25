package br.com.servicemaker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuario")
public class AutenticacaoController {
    @PostMapping("/login");
    Public ResponseEntity login(@ResponseBody @Valid Auten){

    }


}
