package group5.ms.tongji.schedule.service;

import group5.ms.tongji.schedule.dto.ClassResponse;
import group5.ms.tongji.schedule.dto.ScheduleItem;
import group5.ms.tongji.schedule.model.ClassSession;
import group5.ms.tongji.schedule.model.UserClassId;
import group5.ms.tongji.schedule.model.UserClassSession;
import group5.ms.tongji.schedule.repository.ClassesRepository;
import group5.ms.tongji.schedule.repository.UserClassesRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class  ClassService {
    FakeApiData fakeApiData;
    UserClassesRepository userClassesRepository;
    ClassesRepository classesRepository;
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

    public List<ScheduleItem> getClassCoincidences(Integer userId, Integer studentId, LocalDateTime start, LocalDateTime end) {
        if(userClassesRepository.existsByUserClassUserId(userId)){
            getUserClasses(userId, studentId);
        }
        return userClassesRepository.findUserCoincidences(start, end, userId);
    }

    private void getUserClasses(Integer userId, Integer studentId) {
        List<ClassResponse> classResponses = fakeApiData.getClassResponses(studentId);
        extractExistingClasses(classResponses, userId);
        List<ClassSession> newClasses = classSessionMapper.mapClassResponsesToScheduleItem(classResponses, START_DATE, PERIODS, PERIOD_DURATION);
        classesRepository.saveAll(newClasses);
        saveUserClasses(newClasses, userId);
    }

    private void extractExistingClasses(List<ClassResponse> classResponses, Integer userId) {
        List<ClassSession> userExistingClasses = new ArrayList<>();
        for(ClassResponse c : classResponses) {
            List<ClassSession> classSession = classesRepository.findByCode(c.getClassCode());
            if(!classSession.isEmpty()){
                classResponses.remove(c);
                userExistingClasses.addAll(classSession);
            }
        }
        saveUserClasses(userExistingClasses, userId);
    }

    private void saveUserClasses(List<ClassSession> classResponses, Integer userId) {
        List<UserClassSession> us  = new ArrayList<>();
        for(ClassSession c : classResponses) {
            us.add(new UserClassSession(new UserClassId(userId, c.getSessionId())));
        }
        userClassesRepository.saveAll(us);
    }
}
