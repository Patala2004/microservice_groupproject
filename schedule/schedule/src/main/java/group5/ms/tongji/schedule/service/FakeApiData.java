package group5.ms.tongji.schedule.service;

import group5.ms.tongji.schedule.dto.ClassResponse;
import group5.ms.tongji.schedule.dto.ClassTimeTable;
import group5.ms.tongji.schedule.model.ClassSession;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

public class FakeApiData {
    List<ClassResponse> getClassResponses(Integer userId){
        List<ClassResponse> responses = new ArrayList<>();
        List<Integer> weeks = new LinkedList<>();
        for (int i = 1; i <= 17; i++) {
            weeks.add(i);
        }
        ClassTimeTable tt1 = new ClassTimeTable(1, 3, 4, weeks);
        ClassTimeTable tt2 = new ClassTimeTable(2, 5, 6, weeks);
        ClassTimeTable tt3 = new ClassTimeTable(3, 2, 3, weeks);
        
        List<ClassTimeTable> classTimeTables13 = Arrays.asList(tt1, tt3);
        List<ClassTimeTable> classTimeTables2 = Arrays.asList(tt1, tt3);
        responses.add(new ClassResponse("10000001", "Pattern Recognition", classTimeTables13));
        responses.add(new ClassResponse("10000002", "Software Engineering Fundamentals", classTimeTables2));
        return responses;
    }
}
