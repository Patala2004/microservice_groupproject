package microservices.groupproject.post_api.exception;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorMessage {
    private String message;

    private String requestURI;

    public ErrorMessage(String message){
        this.message = message;
    }
}