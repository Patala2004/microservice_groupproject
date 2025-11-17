package group5.ms.tongji.recommendation.controller;

import group5.ms.tongji.recommendation.domain.InteractionTypes;
import group5.ms.tongji.recommendation.dto.UserInteraction;
import group5.ms.tongji.recommendation.exceptions.InteractionTypeException;
import group5.ms.tongji.recommendation.model.UserFrequentTag;
import group5.ms.tongji.recommendation.service.RecommendationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/recommendation/")
@Tag(name = "Recommendation", description = "Recommendation API")
public class RecommendationController {

    private RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("frequents/{userId}")
    public List<UserFrequentTag> getUserFrequentTags(@PathVariable int userId) {
        return recommendationService.getUserFrequentTags(userId);
    }

    @PostMapping("update")
    public void updateRecommendation(@RequestBody UserInteraction interaction) {
        int userId = interaction.getUserId();
        int[] tags = interaction.getTags();
        Date timestamp = interaction.getTimestamp();
        InteractionTypes interactionType = null;
        try{
            interactionType = InteractionTypes.valueOf(interaction.getType().toUpperCase());
        } catch ( IllegalArgumentException e ){
            throw new InteractionTypeException();
        }

        recommendationService.updateRecommendations(userId, tags, timestamp, interactionType);
    }

    @GetMapping("getPosts/{userId}")
    public int[] getRecommendedPosts(@PathVariable int userId, @RequestParam(defaultValue = "10") int limit) {
        return recommendationService.getRecommendedPosts(userId, limit);
    }



}
