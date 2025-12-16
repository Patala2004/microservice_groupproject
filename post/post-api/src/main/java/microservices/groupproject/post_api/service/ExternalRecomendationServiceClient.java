package microservices.groupproject.post_api.service;

import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;

import microservices.groupproject.post_api.exception.ExternalServiceUnavailableException;
import microservices.groupproject.post_api.model.UserRecomResponse;

import org.springframework.stereotype.Service;

@Service
public class ExternalRecomendationServiceClient {
    private final WebClient webClient = WebClient.builder()
            .baseUrl("http://host.docker.internal:8085") // Recomendations ervice url
            .build();

    public UserRecomResponse getUserRecom(int userId) {
        try{
            return webClient.get()
                    .uri("/recom/" + userId)
                    .retrieve()
                    .bodyToMono(UserRecomResponse.class)
                    .block(); // block so it waits for the values instead of returning a promise
        } catch(WebClientException ex){
            throw new ExternalServiceUnavailableException("Recommendation Service is currently unavailable", ex);
        }
    }
}

