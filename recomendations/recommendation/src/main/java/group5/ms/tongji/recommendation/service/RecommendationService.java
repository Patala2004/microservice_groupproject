package group5.ms.tongji.recommendation.service;

import group5.ms.tongji.recommendation.domain.InteractionTypes;
import group5.ms.tongji.recommendation.domain.InteractionTypesWeights;
import group5.ms.tongji.recommendation.dto.RecommendableItem;
import group5.ms.tongji.recommendation.model.UserFrequentTag;
import group5.ms.tongji.recommendation.model.UserTagKey;
import group5.ms.tongji.recommendation.repository.RecommendationRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.PriorityQueue;

@Service
@AllArgsConstructor
public class RecommendationService {

    private RecommendationRepository recommendationRepository;

    private PostServiceClient postServiceClient;

    public void updateRecommendations(int userId, int[] tags, Date timestamp, InteractionTypes iteractionType) {
        HashMap<Integer, UserFrequentTag> userFrequentTags = obtainUserFrequentTagInfo(userId);
        decayAll(userFrequentTags, timestamp);
        for(Integer tag : tags) {
            if(!userFrequentTags.containsKey(tag)) {
                UserTagKey userTag = new UserTagKey(userId, tag);
                UserFrequentTag newFrequentTag = new UserFrequentTag(userTag, 0.1f, timestamp, 1);
                userFrequentTags.put(tag, newFrequentTag);
            }
            updateWeight(userFrequentTags.get(tag), iteractionType);
        }
        recommendationRepository.saveAll(userFrequentTags.values());
    }

    private void updateWeight(UserFrequentTag u, InteractionTypes iteractionType) {
        float impact = 1 / (1 + u.getWeight());
        float typeWeight = InteractionTypesWeights.WEIGHTS.get(iteractionType);
        u.setWeight(u.getWeight()+impact*typeWeight);
        u.setFrequency(u.getFrequency()+1); // ÚTIL?????? NO SE USA DE MOMENTO
    }

    private void decayAll(HashMap<Integer, UserFrequentTag> userFrequentTags, Date timestamp) {
        for(UserFrequentTag u : userFrequentTags.values()) {
            float forgetRate = -0.0231f; //30 days bajará un 50%
            float timeDiff = (timestamp.getTime() - u.getTimestamp().getTime())/(1000f * 60f * 60f * 24f);
            float decay = (float) Math.pow(Math.E, forgetRate*timeDiff);
            u.setWeight(u.getWeight() * decay);
        }
    }

    private HashMap<Integer, UserFrequentTag> obtainUserFrequentTagInfo(int userId) {
        List<UserFrequentTag> userFrequentTags = recommendationRepository.findByUserId(userId);
        HashMap<Integer, UserFrequentTag> tagWeight = new HashMap<>();
        for(UserFrequentTag u : userFrequentTags) {
            tagWeight.put(u.getUserTag().getTagId(), u);
        }
        return tagWeight;
    }

    //--------------------------------------------------------------------------------------------------
    // RECOMMEND POSTS TO USER
    //--------------------------------------------------------------------------------------------------
    public int[] getRecommendedPosts(int userId, int limit) {
        HashMap<Integer, Float> userTags = obtainUserFrequentTagWeight(userId);
        RecommendableItem[] recommendables = postServiceClient.getPostsTags(userTags.keySet());
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
            } else if(bestMatches.peek().getWeight() < matchValue) {
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
        List<UserFrequentTag> userFrequentTags = recommendationRepository.findByUserId(userId);
        HashMap<Integer, Float> tagWeight = new HashMap<>();
        for(UserFrequentTag u : userFrequentTags) {
            tagWeight.put(u.getUserTag().getTagId(), u.getWeight());
        }
        return tagWeight;
    }

    @AllArgsConstructor
    @Getter
    private class Recommendation implements Comparable<Recommendation> {

        private int recommendedId;
        private float weight;

        @Override
        public int compareTo(Recommendation r) {
            return Float.compare(weight, r.weight);
        }
    }

}
