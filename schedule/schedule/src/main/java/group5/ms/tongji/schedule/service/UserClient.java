package group5.ms.tongji.schedule.service;

import com.fasterxml.jackson.databind.JsonNode;
import group5.ms.tongji.schedule.dto.Post;
import group5.ms.tongji.schedule.dto.ScheduleItem;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserClient {
    WebClient userClient;

    public UserClient(
            @Qualifier("userSchedClient") WebClient userClient
    ) {
        this.userClient = userClient;
    }

    public Integer getUserStudentId(Integer userId){
        Integer response =  userClient.get()
                .uri("/user/users/{id}", userId)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(node -> node.get("id").asInt())
                .block();
        if(response == null)
            return null;
        return response;
    }
}
