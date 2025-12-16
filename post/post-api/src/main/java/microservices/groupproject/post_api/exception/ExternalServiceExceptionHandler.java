package microservices.groupproject.post_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;


@RestControllerAdvice
public class ExternalServiceExceptionHandler {
    @ExceptionHandler(ExternalServiceUnavailableException.class)
    @ResponseStatus(HttpStatus.BAD_GATEWAY)
    ErrorMessage externalServiceUnavailable(ExternalServiceUnavailableException ex, HttpServletRequest request) {
        return new ErrorMessage(ex.getMessage(), request.getRequestURI());
    }
}
