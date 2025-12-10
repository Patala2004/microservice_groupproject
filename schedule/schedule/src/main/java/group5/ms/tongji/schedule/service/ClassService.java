package group5.ms.tongji.schedule.service;

import group5.ms.tongji.schedule.dto.ClassResponse;
import group5.ms.tongji.schedule.dto.ScheduleItem;
import group5.ms.tongji.schedule.model.ClassSession;
import group5.ms.tongji.schedule.repository.ClassesRepository;
import group5.ms.tongji.schedule.repository.UserClassesRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ClassService {
    FakeApiData fakeApiData;
    UserClassesRepository userClassesRepository;
    ClassesRepository classesRepository;
    WebClient tongjiClient;
    ClassSessionMapper classSessionMapper;

    private final LocalDate START_DATE = LocalDate.of(2025,9,15);
    private final LocalTime[] PERIODS = new LocalTime[]{
            LocalTime.of(8,0),
            LocalTime.of(8,50),
            LocalTime.of(10,0),
            LocalTime.of(10,50),
            LocalTime.of(13,30),
            LocalTime.of(14,20),
            LocalTime.of(15,30),
            LocalTime.of(16,20),
            LocalTime.of(18,30),
            LocalTime.of(19,20),
            LocalTime.of(20,10)
    };
    private final int PERIOD_DURATION = 45;

    public ClassService(
            @Qualifier("tongjiClient") WebClient tongjiClient
    ) {
        this.tongjiClient = tongjiClient;
    }

    public List<ScheduleItem> getClassCoincidences(Integer userId, LocalDateTime start, LocalDateTime end) {
        if(userClassesRepository.findByIdUserId(userId) == null)
            getUserClasses(userId);
        return userClassesRepository.findUserCoincidences(start, end, userId);
    }

    private void getUserClasses(Integer userId) {
        List<ClassResponse> classResponses = fakeApiData.getClassResponses(userId);
        extractExistingClasses(classResponses);
        List<ClassSession> newClasses = classSessionMapper.mapClassResponsesToScheduleItem(classResponses, START_DATE, PERIODS, PERIOD_DURATION);
        classesRepository.saveAll(newClasses);
    }

    private void extractExistingClasses(List<ClassResponse> classResponses) {
        for(ClassResponse c : classResponses) {
            ClassSession classSession = classesRepository.findByClassCode(c.getClassCode());
            if(classSession!= null){
                classResponses.remove(c);
            }
        }
    }


}
