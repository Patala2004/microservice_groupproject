package group5.ms.tongji.collector.event_collector.controller;

import group5.ms.tongji.collector.event_collector.dto.ErrorResponse;
import group5.ms.tongji.collector.event_collector.dto.UserInteraction;
import group5.ms.tongji.collector.event_collector.service.CollectorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("evcollector")
@Tag(name = "Event Collector", description = "Event Collector API")
@AllArgsConstructor
public class CollectorController {
    CollectorService collectorService;

    @Operation(summary = "Queue interactions for updating user frequent tags")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Correctly queued."),
            @ApiResponse(responseCode = "502", description = "External service unavailable",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    ))
    })
    @PostMapping("")
    public void postUserInteraction(@RequestBody UserInteraction userInteraction) {
        collectorService.queueUserInteraction(userInteraction);
    }
}
