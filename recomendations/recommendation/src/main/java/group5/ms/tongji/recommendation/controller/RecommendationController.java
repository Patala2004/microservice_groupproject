package group5.ms.tongji.recommendation.controller;

import group5.ms.tongji.recommendation.dto.UserInteraction;
import group5.ms.tongji.recommendation.service.RecommendationService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("recommendation/")
@AllArgsConstructor
public class RecommendationController {

    private RecommendationService recommendationService;

    @PostMapping("update")
    public void updateRecommendation(@RequestBody UserInteraction interaction) {
        int userId = interaction.getUserId();
        int[] tags = interaction.getTags();
        Date timestamp = interaction.getTimestamp();
        recommendationService.updateRecommendation(userId, tags, timestamp);
    }

    @GetMapping("get/{userId}")
    public int[] getRecommendedPosts(@PathVariable int userId, @RequestParam(defaultValue = "10") int limit) {
        return recommendationService.getRecommendedPosts(userId, limit);
    }

}
