package group5.ms.tongji.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ScheduleItem {
    LocalDateTime start;
    LocalDateTime end;
    String title;
}
