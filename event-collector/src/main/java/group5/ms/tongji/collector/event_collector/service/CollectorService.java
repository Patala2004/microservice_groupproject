package group5.ms.tongji.collector.event_collector.service;

import group5.ms.tongji.collector.event_collector.dto.UserInteraction;
import lombok.AllArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CollectorService {
    RabbitTemplate rabbitTemplate;
    public void queueUserInteraction(UserInteraction userInteraction){
        rabbitTemplate.convertAndSend("inter.queue", userInteraction);
    }
}
