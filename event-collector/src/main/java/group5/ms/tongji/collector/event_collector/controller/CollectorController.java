package group5.ms.tongji.collector.event_collector.controller;

import group5.ms.tongji.collector.event_collector.dto.UserInteraction;
import group5.ms.tongji.collector.event_collector.service.CollectorService;
import io.swagger.v3.oas.annotations.Operation;
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

    @Operation(summary = "Get user frequent tags")
    @PostMapping("")
    public void postUserInteraction(@RequestBody UserInteraction userInteraction) {
        collectorService.queueUserInteraction(userInteraction);
    }

}
