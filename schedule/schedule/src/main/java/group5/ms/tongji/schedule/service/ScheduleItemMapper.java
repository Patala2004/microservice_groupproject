package group5.ms.tongji.schedule.service;

import group5.ms.tongji.schedule.dto.ClassResponse;
import group5.ms.tongji.schedule.dto.ClassTimeTable;
import group5.ms.tongji.schedule.dto.Post;
import group5.ms.tongji.schedule.dto.ScheduleItem;
import group5.ms.tongji.schedule.model.ClassSession;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class ScheduleItemMapper {
    public List<ScheduleItem> mapPostsToScheduleItem(List<Post> posts){
        List<ScheduleItem> scheduleItems = new ArrayList<>();
        for(Post p : posts){
            if(p.getEventTimeEnd() == null)
                p.setEventTimeEnd(p.getEventTimeStart());
            scheduleItems.add(new ScheduleItem(p.getEventTimeStart(), p.getEventTimeEnd(), p.getTitle()));
        }
        return scheduleItems;
    }

    public ScheduleItem mapPostToScheduleItem(Post post){
        return new ScheduleItem(post.getEventTimeStart(), post.getEventTimeStart(), post.getTitle());
    }

    public List<ScheduleItem> mapClassResponsesToScheduleItem(List<ClassResponse> classResponses, LocalDate startDate,
                                                              LocalTime[] periods, int periodDuration){
        List<ScheduleItem> scheduleItems = new ArrayList<>();
        for(ClassResponse c : classResponses){
            for(ClassTimeTable ct : c.getTimeTableList()){
                int periodStart = ct.getTimeStart();
                for(Integer week : ct.getWeeks()){
                    LocalDateTime dayStart = LocalDateTime.of(startDate.plusDays(7*week-1+ct.getDayOfWeek()-1),
                            periods[periodStart]);
                    LocalDateTime dayEnd = LocalDateTime.of(startDate.plusDays(7*week-1+ct.getDayOfWeek()-1),
                            periods[periodStart].plusMinutes(periodDuration));
                    scheduleItems.add(new ScheduleItem(dayStart, dayEnd, c.getCourseName()));
                }
            }
        }
        return scheduleItems;
    }


    public ScheduleItem mapClassSessionToScheduleItem(ClassSession classSession) {
        return new ScheduleItem(classSession.getStart(), classSession.getEnd(), classSession.getName());
    }
}
