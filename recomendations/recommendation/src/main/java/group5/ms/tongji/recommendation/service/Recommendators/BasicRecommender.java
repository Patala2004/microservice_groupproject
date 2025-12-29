package group5.ms.tongji.recommendation.service.Recommendators;

import group5.ms.tongji.recommendation.dto.RecommendableItem;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.PriorityQueue;

@AllArgsConstructor
@Component("BasicRecommender")
public class BasicRecommender extends AbstractRecommendator implements RecommendationSelector {
    @Override
    public int[] selectBestMatches(HashMap<Integer, Float> userTags, int limit, List<RecommendableItem> recommendables) {
        PriorityQueue<Recommendation> bestMatches = new PriorityQueue<>();
        for(RecommendableItem r : recommendables) {
            float matchValue = 0;
            Integer[] rTags = r.getTags();
            for(int rTag : rTags) {
                matchValue += userTags.getOrDefault(rTag, 0f);
            }
            Recommendation recommendation = new Recommendation(r.getId(), matchValue);
            if(bestMatches.size() < limit) {
                bestMatches.add(recommendation);
            } else if(bestMatches.peek() != null && bestMatches.peek().getWeight() < matchValue) {
                bestMatches.poll();
                bestMatches.add(recommendation);
            }
        }
        return extractRecommendationsId(bestMatches);
    }
}
