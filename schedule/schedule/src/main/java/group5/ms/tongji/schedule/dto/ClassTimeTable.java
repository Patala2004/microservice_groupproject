package group5.ms.tongji.schedule.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
@AllArgsConstructor
@Getter
public class ClassTimeTable {
    private Integer dayOfWeek;
    private Integer timeStart;
    private Integer timeEnd;
    private List<Integer> weeks;
}
