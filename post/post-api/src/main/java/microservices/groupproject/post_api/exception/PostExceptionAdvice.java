package microservices.groupproject.post_api.exception;

import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;

@RestControllerAdvice
public class PostExceptionAdvice {
    // @ExceptionHandler(UserNotFoundException.class)
    // @ResponseStatus(HttpStatus.NOT_FOUND)
    // ErrorMessage userNotFoundHandler(UserNotFoundException ex) {
    // return new ErrorMessage(ex.getMessage());
    // }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorMessage handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ErrorMessage(errors.toString());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorMessage handleInvalidEnumException(HttpMessageNotReadableException ex) {
        Throwable cause = ex.getCause();
        if (cause instanceof InvalidFormatException invalidFormatException) {
            Class<?> targetType = invalidFormatException.getTargetType();
            if (targetType.isEnum()) {
                String invalidValue = invalidFormatException.getValue().toString();
                Object[] allowedValues = Arrays.stream(targetType.getEnumConstants()).toArray();
                return new ErrorMessage(
                        "Invalid value '" + invalidValue + "' for field of type " + targetType.getSimpleName() +
                                ". Allowed values are: " + Arrays.toString(allowedValues));
            }
        }
        return new ErrorMessage("Malformed JSON request");
    }

    @ExceptionHandler(FileStorageException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorMessage handleIOException(FileStorageException ex) {
        return new ErrorMessage("Failed to store file: " + ex.getMessage());
    }
}