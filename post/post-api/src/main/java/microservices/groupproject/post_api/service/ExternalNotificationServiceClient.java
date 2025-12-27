package microservices.groupproject.post_api.service;

import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;

import microservices.groupproject.post_api.exception.ExternalServiceBadRequestException;
import microservices.groupproject.post_api.exception.ExternalServiceUnavailableException;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;

@Service
public class ExternalNotificationServiceClient {
    private final WebClient webClient = WebClient.builder()
            .baseUrl("http://host.docker.internal:8084") // Notification service url
            .build();

    public Mono<Void> sendWechatNotification(Long userId, String message) {
        Map<String, String> payload = new HashMap<>();
        payload.put("message", message);
        try{
            return webClient.post()
                    .uri("/notify/" + userId)
                    .bodyValue(payload)
                    .retrieve()
                    .onStatus( // On 4xx error pass it down
                        HttpStatusCode::is4xxClientError,
                        response -> response.bodyToMono(String.class)
                            .map(body -> new ExternalServiceBadRequestException(
                                    body,
                                    HttpStatus.valueOf(response.statusCode().value())
                            ))
                    )
                    .onStatus(
                        HttpStatusCode::is5xxServerError,
                        response -> response.bodyToMono(String.class)
                                .map(body -> new ExternalServiceUnavailableException(
                                        "Notification service returned 5xx" + response.statusCode() +":\n" + body
                                ))
                    )
                    .toBodilessEntity()
                    .then();
        } catch(WebClientException ex){
            throw new ExternalServiceUnavailableException("Notification Service is currently unavailable", ex);
        }
    }
}

