package group5.ms.tongji.schedule.controller;

import group5.ms.tongji.schedule.dto.ScheduleItem;
import group5.ms.tongji.schedule.service.ScheduleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("recom/")
@Tag(name = "Recommendation", description = "Recommendation API")
@AllArgsConstructor
public class ScheduleController {

    private ScheduleService scheduleService;

    @GetMapping("{userId}")
    public List<ScheduleItem> checkAvailability(
            @PathVariable Integer userId,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end
            ){
        return scheduleService.checkAvailability(userId,start,end);
    }
}
