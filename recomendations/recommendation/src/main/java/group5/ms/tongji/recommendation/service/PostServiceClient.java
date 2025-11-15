package group5.ms.tongji.recommendation.service;

import group5.ms.tongji.recommendation.dto.RecommendableItem;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Set;

@Slf4j
@Service
@AllArgsConstructor
public class PostServiceClient {

    WebClient client;

    public RecommendableItem[] getPostsTags(Set<Integer> ids) {
        return client.get()
                .uri(uriBuilder ->
                        uriBuilder
                                .path("/post/api/posts")
                                .queryParam("ids", ids)
                                .build()
                )
                .retrieve()
                .bodyToMono(RecommendableItem[].class).block();
    }


}
