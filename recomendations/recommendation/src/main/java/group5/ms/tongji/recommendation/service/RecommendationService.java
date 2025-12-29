package group5.ms.tongji.recommendation.service;

import group5.ms.tongji.recommendation.dto.RecommendableItem;
import group5.ms.tongji.recommendation.dto.FrequentTag;
import group5.ms.tongji.recommendation.exceptions.NotFoundException;
import group5.ms.tongji.recommendation.repository.posttag.PostTagRepository;
import group5.ms.tongji.recommendation.service.Mappers.TagMapper;
import group5.ms.tongji.recommendation.service.Recommendators.RecommendationSelector;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
@Slf4j
public class   RecommendationService {

    private UserPrefServiceClient userPrefServiceClient;
    private TagMapper tagMapper;
    private PostTagRepository postTagRepository;
    @Autowired
    @Qualifier("BasicRecommender")
    private RecommendationSelector recommendator;

    public int[] getRecommendedItems(int userId, int limit) {
        FrequentTag[] userFrequentTagsInfo = userPrefServiceClient.getUserFrequentTags(userId);
        log.info(Arrays.toString(userFrequentTagsInfo));
        HashMap<Integer, Float> userTags = tagMapper.toWeightMap(userFrequentTagsInfo);
        if(userTags.isEmpty())
            throw new NotFoundException("User", userId);
        List<RecommendableItem> recommendables = postTagRepository.findAllRecommendablePosts(extractUserFrequentTags(userFrequentTagsInfo));
        for(RecommendableItem r : recommendables)
            log.info(r.getId().toString());
        return recommendator.selectBestMatches(userTags,limit,recommendables);
    }

    private Integer[] extractUserFrequentTags(FrequentTag[] userFrequentTags) {
        Integer[] tags = new Integer[userFrequentTags.length];
        int i = 0;
        for(FrequentTag u : userFrequentTags) {
            tags[i] = u.getTagId();
            i++;
        }
        return tags;
    }

}
