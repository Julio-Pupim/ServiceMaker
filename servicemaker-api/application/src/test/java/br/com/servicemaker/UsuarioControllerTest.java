package br.com.servicemaker;

import br.com.servicemaker.config.test.AbstractIntegrationTest;
import br.com.servicemaker.usuarioapi.api.dto.UsuarioRequest;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import java.util.List;

import static org.hamcrest.Matchers.containsString;
class UsuarioControllerTest extends AbstractIntegrationTest {

    @Test
    void deveRegistrarUsuarioComSucesso() {
        UsuarioRequest novoUsuario = new UsuarioRequest(
                "Teste Integration",
                "integration@teste.com",
                "SenhaForte123!",
                List.of("CLIENTE")
        );

        RestAssured.given()
                .contentType(ContentType.JSON)
                .body(novoUsuario)
                .when()
                .post("/usuario/registro")
                .then()
                .statusCode(HttpStatus.CREATED.value())
                .header("Location", containsString("/usuario/"));
    }
}