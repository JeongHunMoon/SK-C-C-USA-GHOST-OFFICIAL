package GHOST.sk_ghost.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class JUnitControllerTest {
    @Autowired
    private JUnitController jUnitController;
    @Test
    void helloWorld() {
        assertThat(jUnitController.helloWorld()).isEqualTo("HelloWorld");
        System.out.println("test is good");
    }
}

