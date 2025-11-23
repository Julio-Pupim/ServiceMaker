package br.com.servicemaker.keys;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class Uuidv7GeneratorTest {

    private Uuidv7Generator uuidv7Generator;

    @BeforeEach
    void setUp() {
        uuidv7Generator = new Uuidv7Generator();
    }

    @Test
    void shouldGenerateNonNullUuid() {
        // when
        Object generatedObject = uuidv7Generator.generate(null, null);

        // then
        assertNotNull(generatedObject);
        assertThat(generatedObject).isInstanceOf(UUID.class);
    }

    @Test
    void shouldGenerateDifferentUuidsOnConsecutiveCalls() {
        // when
        Object uuid1 = uuidv7Generator.generate(null, null);
        Object uuid2 = uuidv7Generator.generate(null, null);

        // then
        assertNotNull(uuid1);
        assertNotNull(uuid2);
        assertNotEquals(uuid1, uuid2);
    }
}
