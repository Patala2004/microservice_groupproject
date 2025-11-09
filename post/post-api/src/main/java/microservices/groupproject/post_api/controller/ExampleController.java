package microservices.groupproject.post_api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExampleController {

    @GetMapping("/api/hello")
    public String hello() {
        return "Hello, Spring Boot + Swagger UI!";
    }
}