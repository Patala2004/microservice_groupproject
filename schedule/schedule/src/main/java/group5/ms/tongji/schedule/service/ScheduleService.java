package group5.ms.tongji.schedule.service;

import group5.ms.tongji.schedule.controller.ScheduleController;
import group5.ms.tongji.schedule.dto.ClassResponse;
import group5.ms.tongji.schedule.dto.Post;
import group5.ms.tongji.schedule.dto.ScheduleItem;
import group5.ms.tongji.schedule.model.ClassSession;
import group5.ms.tongji.schedule.model.UserClassSession;
import group5.ms.tongji.schedule.repository.ClassesRepository;
import group5.ms.tongji.schedule.repository.UserClassesRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Stream;

@Service
@AllArgsConstructor
@Slf4j
public class ScheduleService {
    ClassService classService;
    PostService postService;

    public List<ScheduleItem> checkAvailability(Integer userId, LocalDateTime start, LocalDateTime end){
        List<ScheduleItem> coincidences = postService.getPostCoincidences(userId, start, end);
        List<ScheduleItem> classCoincidences = classService.getClassCoincidences(userId, start, end);
        return Stream.concat(coincidences.stream(), classCoincidences.stream()).toList();
    }

}
