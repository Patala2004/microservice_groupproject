package group5.ms.tongji.recommendation.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Map;

@RestControllerAdvice
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class RecommendationAdvice {

    @ExceptionHandler(InteractionTypeException.class)
    public ResponseEntity<Object> handleInvalidInteractionType (InteractionTypeException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage(), "timestamp", Instant.now().toString()));
    }
}
