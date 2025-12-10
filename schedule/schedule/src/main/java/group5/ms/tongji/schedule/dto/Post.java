package group5.ms.tongji.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
public class Post {
    Integer id;
    String title;
    LocalDateTime eventTimeStart;
    LocalDateTime eventTimeEnd;

}
