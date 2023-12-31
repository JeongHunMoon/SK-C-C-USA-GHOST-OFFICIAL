package GHOST.sk_ghost.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JUnitController {
    @GetMapping("/123")
    public String helloWorld(){
        return "HelloWorld";
    }
}
