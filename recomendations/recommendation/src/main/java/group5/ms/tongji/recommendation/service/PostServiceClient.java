package group5.ms.tongji.recommendation.service;

import group5.ms.tongji.recommendation.dto.UserFrequentTag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Service
@AllArgsConstructor
public class PostServiceClient {

    WebClient client;

    public UserFrequentTag[] getUserFrequentTags(int id) {
        return client.get()
                .uri(uriBuilder ->
                        uriBuilder
                                .path("/upref")
                                .queryParam("id", id)
                                .build()
                )
                .retrieve()
                .bodyToMono(UserFrequentTag[].class).block();
    }


}
