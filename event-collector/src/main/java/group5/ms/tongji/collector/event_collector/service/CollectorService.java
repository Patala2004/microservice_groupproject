package group5.ms.tongji.collector.event_collector.service;

import group5.ms.tongji.collector.event_collector.dto.UserInteractions;
import group5.ms.tongji.collector.event_collector.dto.UserInteraction;
import lombok.AllArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CollectorService {
    RabbitTemplate rabbitTemplate;
    public void queueUserInteractions(UserInteractions userInteraction){
        UserInteraction u = new UserInteraction(userInteraction.getUserId(), 1, userInteraction.getTimestamp(), userInteraction.getType());
        for(int i : userInteraction.getItemId()){
            u.setItemId(i);
            rabbitTemplate.convertAndSend("","inter.queue", u);
        }
        
    }

    public void queueUserInteraction(UserInteraction userInteraction){
        rabbitTemplate.convertAndSend("","inter.queue", userInteraction);
    }


}
