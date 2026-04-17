package br.com.serviceMaker.users.application.command;

public record LoginCommand(String email, String rawPassword) {}
