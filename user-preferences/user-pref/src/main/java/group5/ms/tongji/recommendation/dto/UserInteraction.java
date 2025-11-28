package group5.ms.tongji.recommendation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserInteraction {

    private int userId;
    private int[] tags;
    private Date timestamp;
    private String type;

}
