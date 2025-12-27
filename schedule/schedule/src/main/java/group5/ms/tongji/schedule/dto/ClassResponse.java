package group5.ms.tongji.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ClassResponse {
    private String classCode;
    private String courseName;
    private List<ClassTimeTable> timeTableList;
}
