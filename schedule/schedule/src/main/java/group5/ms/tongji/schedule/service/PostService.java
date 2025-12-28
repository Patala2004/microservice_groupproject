package group5.ms.tongji.schedule.service;

import group5.ms.tongji.schedule.dto.Post;
import group5.ms.tongji.schedule.dto.ScheduleItem;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class PostService {
    @Qualifier("postClient")
    WebClient postClient;
    ScheduleItemMapper scheduleItemMapper;

    public List<ScheduleItem> getPostCoincidences(Integer userId, LocalDateTime start, LocalDateTime end){
        List<Post> response =  postClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/post")
                        .queryParam("participantId", userId)
                        .queryParam("beforeEventDateStamp", end)
                        .queryParam("afterEventDateStamp", start)
                        .build()
                )
                .retrieve()
                .bodyToFlux(Post.class)
                .collectList()
                .block();
        if(response == null)
            return null;
        return scheduleItemMapper.mapPostsToScheduleItem(response);
    }
}
