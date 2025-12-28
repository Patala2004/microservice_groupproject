package microservices.groupproject.post_api.exception;

import org.springframework.http.HttpStatus;

public class ExternalServiceBadRequestException extends RuntimeException{

    private final HttpStatus status;

    public ExternalServiceBadRequestException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public ExternalServiceBadRequestException(String message, Throwable cause, HttpStatus status) {
        super(message, cause);
        this.status = status;
    }

    public HttpStatus geHttpStatus(){
        return this.status;
    }
}


