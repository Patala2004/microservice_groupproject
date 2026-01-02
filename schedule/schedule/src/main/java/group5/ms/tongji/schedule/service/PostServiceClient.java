package group5.ms.tongji.schedule.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import group5.ms.tongji.schedule.dto.Post;
import group5.ms.tongji.schedule.dto.ScheduleItem;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class PostServiceClient {

    @Qualifier("postClient")
    WebClient postClient;

    ScheduleItemMapper scheduleItemMapper;

    private final ObjectMapper mapper = new ObjectMapper();

    public List<ScheduleItem> getPostCoincidences(Integer userId, LocalDateTime start, LocalDateTime end) {
        try {
            JsonNode root = postClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/post")
                            .queryParam("participantId", userId)
                            .queryParam("beforeEventDateStamp", end)
                            .queryParam("afterEventDateStamp", start)
                            .build()
                    )
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();
            if (root == null || !root.has("content")) {
                return List.of();
            }
            JsonNode content = root.get("content");
            if (!content.isArray() || content.isEmpty()) {
                // Lista vacía
                return List.of();
            }
            List<Post> posts = new ArrayList<>();
            for (JsonNode node : content) {
                posts.add(mapper.treeToValue(node, Post.class));
            }
            return scheduleItemMapper.mapPostsToScheduleItem(posts);

        } catch (Exception e) {
            return List.of();
        }
    }
}
