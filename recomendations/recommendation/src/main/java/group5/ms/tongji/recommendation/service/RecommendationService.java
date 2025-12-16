package group5.ms.tongji.recommendation.service;

import group5.ms.tongji.recommendation.dto.RecommendableItem;
import group5.ms.tongji.recommendation.dto.UserFrequentTag;
import group5.ms.tongji.recommendation.exceptions.NotFoundException;
import group5.ms.tongji.recommendation.repository.posttag.PostTagRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
@Slf4j
public class   RecommendationService {

    private UserPrefServiceClient userPrefServiceClient;
    private TagMapper tagMapper;
    private PostTagRepository postTagRepository;

    public int[] getRecommendedItems(int userId, int limit) {
        UserFrequentTag[] userFrequentTagsInfo = userPrefServiceClient.getUserFrequentTags(userId);
        log.info(Arrays.toString(userFrequentTagsInfo));
        HashMap<Integer, Float> userTags = tagMapper.toWeightMap(userFrequentTagsInfo);
        if(userTags.isEmpty())
            throw new NotFoundException("User", userId);
        List<RecommendableItem> recommendables = postTagRepository.findAllRecommendablePosts(extractUserFrequentTags(userFrequentTagsInfo));
        for(RecommendableItem r : recommendables)
            log.info(r.getId().toString());
        return selectBestMatches(userTags,limit,recommendables);
    }

    private int[] selectBestMatches(HashMap<Integer, Float> userTags, int limit, List<RecommendableItem> recommendables) {
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
        log.info("-----");
        for(Recommendation r : bestMatches)
            log.info(r.getRecommendedId()+"");
        return extractRecommendationsId(bestMatches);
    }

    private int[] extractRecommendationsId(PriorityQueue<Recommendation> bestFinds) {
        int size = bestFinds.size();
        int[] recommendationsId = new int[bestFinds.size()];
        for(int i = 0; i < size; i++) {
            Recommendation r = bestFinds.poll();
            recommendationsId[size-1-i] = r.getRecommendedId();
        }
        log.info("_-_-_-_");
        for(int r : recommendationsId){
            log.info(r+"");
        }
        return recommendationsId;
    }

    private Integer[] extractUserFrequentTags(UserFrequentTag[] userFrequentTags) {
        Integer[] tags = new Integer[userFrequentTags.length];
        int i = 0;
        for(UserFrequentTag u : userFrequentTags) {
            tags[i] = u.getUserTag().getTagId();
            i++;
        }
        return tags;
    }

    @AllArgsConstructor
    @Getter
    private static class Recommendation implements Comparable<Recommendation> {

        private int recommendedId;
        private float weight;

        @Override
        public int compareTo(Recommendation r) {
            return Float.compare(weight, r.weight);
        }
    }

}
