package group5.ms.tongji.recommendation.service;

import group5.ms.tongji.recommendation.dto.UserFrequentTag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Service
@AllArgsConstructor
public class UserPrefServiceClient {

    WebClient client;

    public UserFrequentTag[] getUserFrequentTags(int id) {
        return client.get()
                .uri("/upref/{id}", id
                )
                .retrieve()
                .bodyToMono(UserFrequentTag[].class).block();
    }


}
