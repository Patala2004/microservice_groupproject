package microservices.groupproject.post_api.service;

import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;

import microservices.groupproject.post_api.exception.ExternalServiceBadRequestException;
import microservices.groupproject.post_api.exception.ExternalServiceUnavailableException;

import java.util.List;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;

@Service
public class ExternalRecomendationServiceClient {
    private final WebClient webClient = WebClient.builder()
            .baseUrl("http://host.docker.internal:8085") // Recomendations ervice url
            .build();

    public List<Integer> getUserRecom(int userId) {
        try{
            return webClient.get()
                    .uri("/recom/" + userId)
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
                                        "Recommendation service returned 5xx" + response.statusCode() +":\n" + body

                                ))
                    )
                    .bodyToMono(new ParameterizedTypeReference<List<Integer>>() {})
                    .block(); // block so it waits for the values instead of returning a promise
        } catch(WebClientException ex){
            throw new ExternalServiceUnavailableException("Recommendation Service is currently unavailable", ex);
        }
    }
}

