package group5.ms.tongji.collector.event_collector.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserInteractions {

    private int userId;
    private int[] itemId;
    private Date timestamp;
    private String type;

}
