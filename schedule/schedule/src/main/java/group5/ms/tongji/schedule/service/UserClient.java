package group5.ms.tongji.schedule.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Service
public class UserClient {
    private final WebClient userClient;

    public UserClient(@Qualifier("userSchedClient") WebClient userClient) {
        this.userClient = userClient;
    }

    public Integer getUserStudentId(Integer userId) {
        try {
            JsonNode node = userClient.get()
                    .uri("/user/users/{id}", userId)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();
            if (node == null || node.isEmpty()) {
                return null;
            }
            JsonNode idNode = node.get("id");
            if (idNode == null || idNode.isNull() || idNode.asText().isBlank()) {
                return null;
            }

            return idNode.asInt();

        } catch (Exception e) {
            return null;
        }
    }
}
