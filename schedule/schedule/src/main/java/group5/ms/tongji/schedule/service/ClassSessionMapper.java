package group5.ms.tongji.schedule.service;

import group5.ms.tongji.schedule.dto.ClassResponse;
import group5.ms.tongji.schedule.dto.ClassTimeTable;
import group5.ms.tongji.schedule.dto.Post;
import group5.ms.tongji.schedule.dto.ScheduleItem;
import group5.ms.tongji.schedule.model.ClassSession;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Component
@Slf4j
public class ClassSessionMapper {


    public ScheduleItem mapPostToScheduleItem(Post post){
        return new ScheduleItem(post.getEventTimeStart(), post.getEventTimeStart(), post.getTitle());
    }

    public List<ClassSession> mapClassResponsesToScheduleItem(List<ClassResponse> classResponses, LocalDate startDate,
                                                              LocalTime[] periods, int periodDuration){
        List<ClassSession> scheduleItems = new ArrayList<>();
        for(ClassResponse c : classResponses){
            for(ClassTimeTable ct : c.getTimeTableList()){
                int periodStart = ct.getTimeStart();
                int periodEnd = ct.getTimeEnd();
                int totalDuration = (periodEnd - periodStart+1)*periodDuration;
                for(Integer week : ct.getWeeks()){
                    LocalDateTime dayStart = LocalDateTime.of(startDate.plusDays(7*(week-1)+ct.getDayOfWeek()-1),
                            periods[periodStart-1]);
                    LocalDateTime dayEnd = LocalDateTime.of(startDate.plusDays(7*(week-1)+ct.getDayOfWeek()-1),
                            periods[periodStart-1].plusMinutes(totalDuration));
                    scheduleItems.add(new ClassSession(c.getClassCode(),c.getCourseName(),dayStart, dayEnd));
                }

            }
        }
        return scheduleItems;
    }

}
