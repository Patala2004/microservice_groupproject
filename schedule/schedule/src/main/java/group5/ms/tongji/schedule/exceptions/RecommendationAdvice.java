package group5.ms.tongji.schedule.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.reactive.function.client.WebClientRequestException;

import java.time.Instant;
import java.util.Map;

@RestControllerAdvice
public class RecommendationAdvice {

    @ExceptionHandler(WebClientRequestException.class)
    public ResponseEntity<Object> handleWebClientRequestException (WebClientRequestException ex) {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("error", "external service unavailable", "timestamp", Instant.now().toString()));
    }


}
