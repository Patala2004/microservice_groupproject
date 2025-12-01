package group5.ms.tongji.recommendation.service;

import group5.ms.tongji.recommendation.dto.RecommendableItem;
import group5.ms.tongji.recommendation.exceptions.NotFoundException;
import group5.ms.tongji.recommendation.model.UserFrequentTag;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.PriorityQueue;

@Service
@AllArgsConstructor
public class   RecommendationService {

    private PostServiceClient postServiceClient;

    public int[] getRecommendedItems(int userId, int limit) {
        HashMap<Integer, Float> userTags = obtainUserFrequentTagWeight(userId);
        if(userTags.isEmpty())
            throw new NotFoundException("User", userId);
        RecommendableItem[] recommendables = null; //TODO hacer consulta en la databse itemTAG/userTag
        return selectBestMatches(userTags,limit,recommendables);
    }

    private int[] selectBestMatches(HashMap<Integer, Float> userTags, int limit, RecommendableItem[] recommendables) {
        PriorityQueue<Recommendation> bestMatches = new PriorityQueue<>();
        for(RecommendableItem r : recommendables) {
            float matchValue = 0;
            int[] rTags = r.getTags();
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

    private int[] extractRecommendationsId(PriorityQueue<Recommendation> bestFinds) {
        int[] recommendationsId = new int[bestFinds.size()];
        for(int i = 0; i < bestFinds.size(); i++) {
            Recommendation r = bestFinds.poll();
            recommendationsId[i] = r.getRecommendedId();
        }
        return recommendationsId;
    }

    private HashMap<Integer, Float> obtainUserFrequentTagWeight(int userId) {
        List<UserFrequentTag> userFrequentTags = null; //TODO llamar a la API de user-preferences
        HashMap<Integer, Float> tagWeight = new HashMap<>();
        for(UserFrequentTag u : userFrequentTags) {
            tagWeight.put(u.getUserTag().getTagId(), u.getWeight());
        }
        return tagWeight;
    }

    @AllArgsConstructor
    @Getter
    private static class Recommendation implements Comparable<Recommendation> {

        private int recommendedId;
        private float   weight;

        @Override
        public int compareTo(Recommendation r) {
            return Float.compare(weight, r.weight);
        }
    }

}
