package group5.ms.tongji.schedule.controller;

import group5.ms.tongji.schedule.dto.ErrorResponse;
import group5.ms.tongji.schedule.dto.ScheduleItem;
import group5.ms.tongji.schedule.service.ScheduleService;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("schedule/")
@Tag(name = "Schedule", description = "Schedule API")
@AllArgsConstructor
@Slf4j
public class ScheduleController {

    private ScheduleService scheduleService;

    @GetMapping("{userId}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Coincidences successfully retrieved.",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = ScheduleItem.class))
                    )),
            @ApiResponse(responseCode = "502", description = "External service unavailable ",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    ))

    })
    public List<ScheduleItem> checkAvailability(
            @PathVariable Integer userId,
            @RequestParam Integer studentId,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end
            ){
        return scheduleService.checkAvailability(userId,studentId,start,end);
    }
}
