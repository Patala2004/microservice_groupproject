package group5.ms.tongji.recommendation.controller;

import group5.ms.tongji.recommendation.domain.InteractionTypes;
import group5.ms.tongji.recommendation.dto.UserInteraction;
import group5.ms.tongji.recommendation.service.RecommendationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("api/recommendation/")
@Tag(name = "Recommendation", description = "Recommendation API")
@AllArgsConstructor
public class RecommendationController {

    private RecommendationService recommendationService;

    @PostMapping("update")
    public void updateRecommendation(@RequestBody UserInteraction interaction) {
        int userId = interaction.getUserId();
        int[] tags = interaction.getTags();
        Date timestamp = interaction.getTimestamp();
        InteractionTypes interactionType = InteractionTypes.valueOf(interaction.getType());
        recommendationService.updateRecommendations(userId, tags, timestamp, interactionType);
    }

    @GetMapping("get/{userId}")
    public int[] getRecommendedPosts(@PathVariable int userId, @RequestParam(defaultValue = "10") int limit) {
        return recommendationService.getRecommendedPosts(userId, limit);
    }

}
