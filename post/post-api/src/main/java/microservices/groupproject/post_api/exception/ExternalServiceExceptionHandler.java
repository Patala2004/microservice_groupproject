package microservices.groupproject.post_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;


@RestControllerAdvice
public class ExternalServiceExceptionHandler {
    @ExceptionHandler(ExternalServiceUnavailableException.class)
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    ErrorMessage externalServiceUnavailable(ExternalServiceUnavailableException ex, HttpServletRequest request) {
        return new ErrorMessage(ex.getMessage(), request.getRequestURI());
    }
    
    @ExceptionHandler(ExternalServiceBadRequestException.class)
    ResponseEntity<ErrorMessage> externalServiceHandle4xx(ExternalServiceBadRequestException ex, HttpServletRequest request) {
        ErrorMessage errmsg = new ErrorMessage(ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(ex.geHttpStatus()).body(errmsg);
    }
}

