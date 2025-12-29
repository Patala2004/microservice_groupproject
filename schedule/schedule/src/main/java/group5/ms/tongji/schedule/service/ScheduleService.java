package group5.ms.tongji.schedule.service;

import group5.ms.tongji.schedule.dto.ScheduleItem;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Stream;

@Service
@AllArgsConstructor
@Slf4j
public class ScheduleService {
    ClassService classService;
    PostClient postClient;

    public List<ScheduleItem> checkAvailability(Integer userId, LocalDateTime start, LocalDateTime end){
        List<ScheduleItem> coincidences = postClient.getPostCoincidences(userId, start, end);
        List<ScheduleItem> classCoincidences = classService.getClassCoincidences(userId, start, end);
        return Stream.concat(coincidences.stream(), classCoincidences.stream()).toList();
    }

}
