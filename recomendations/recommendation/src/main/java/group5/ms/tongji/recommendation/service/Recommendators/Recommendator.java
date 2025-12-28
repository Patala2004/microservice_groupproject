package group5.ms.tongji.recommendation.service.Recommendators;

import group5.ms.tongji.recommendation.dto.RecommendableItem;
import group5.ms.tongji.recommendation.service.RecommendationService;

import java.util.HashMap;
import java.util.List;
import java.util.PriorityQueue;

public interface Recommendator {

    public int[] selectBestMatches(HashMap<Integer, Float> userTags, int limit, List<RecommendableItem> recommendables);


}
