package group5.ms.tongji.recommendation.service;

import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import group5.ms.tongji.recommendation.dto.FrequentTag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@AllArgsConstructor
public class UserPrefServiceClient {

    WebClient client;

    public FrequentTag[] getUserFrequentTags(int id) {
        return client.get()
                .uri("/upref/{id}", id
                )
                .retrieve()
                .onStatus(HttpStatusCode::isError, response ->
                    response.bodyToMono(String.class)
                        .defaultIfEmpty("")
                        .flatMap(body -> Mono.error(
                            new ResponseStatusException(
                                response.statusCode(),
                                body.isBlank() ? "Downstream error" : body
                            )
                        ))
                )
                .bodyToMono(FrequentTag[].class).block();
    }


}
