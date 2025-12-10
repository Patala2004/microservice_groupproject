package group5.ms.tongji.schedule.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
@AllArgsConstructor
@Getter
public class ClassTimeTable {
    private Integer dayOfWeek;       // 1=Monday ... 7=Sunday
    private Integer timeStart;       // ejemplo: 5 → 5ª hora
    private Integer timeEnd;
    private List<Integer> weeks;
}
