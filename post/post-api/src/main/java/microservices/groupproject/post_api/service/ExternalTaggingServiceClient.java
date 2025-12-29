package microservices.groupproject.post_api.service;

import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;

import microservices.groupproject.post_api.exception.ExternalServiceBadRequestException;
import microservices.groupproject.post_api.exception.ExternalServiceUnavailableException;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ExternalTaggingServiceClient {
    private final WebClient webClient = WebClient.builder()
            .baseUrl("http://host.docker.internal:8087") // Tag service url
            .build();

    public ResponseEntity<Void> sendPostId(Long postId) {
        try{
            return webClient.post()
                    .uri(uriBuilder ->
                        uriBuilder
                            .path("/tag")
                            .queryParam("post_id", postId)
                            .build()
                    )
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
                                        "Taging service returned 5xx" + response.statusCode() +":\n" + body
                                ))
                    )
                    .toBodilessEntity()
                    .block(); // block so it waits for the values instead of returning a promise
        } catch(WebClientException ex){
            throw new ExternalServiceUnavailableException("Taging Service is currently unavailable", ex);
        }
    }

    public ResponseEntity<Void> deletePostId(Long postId) {
        try{
            return webClient.delete()
                    .uri(uriBuilder ->
                        uriBuilder
                            .path("/tag")
                            .queryParam("post_id", postId)
                            .build()
                    )
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
                                        "Taging service returned 5xx" + response.statusCode() +":\n" + body
                                ))
                    )
                    .toBodilessEntity()
                    .block(); // block so it waits for the values instead of returning a promise
        } catch(WebClientException ex){
            throw new ExternalServiceUnavailableException("Taging Service is currently unavailable", ex);
        }
    }
}

