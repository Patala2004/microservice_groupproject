package group5.ms.tongji.collector.event_collector.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@Getter
@Setter
public class UserInteraction {

    private int userId;
    private int itemId;
    private Date timestamp;
    private String type;

}
