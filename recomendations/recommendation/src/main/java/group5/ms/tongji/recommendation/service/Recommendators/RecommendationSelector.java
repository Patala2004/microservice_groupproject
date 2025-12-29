package group5.ms.tongji.recommendation.service.Recommendators;

import group5.ms.tongji.recommendation.dto.RecommendableItem;

import java.util.HashMap;
import java.util.List;

public interface RecommendationSelector {

    public int[] selectBestMatches(HashMap<Integer, Float> userTags, int limit, List<RecommendableItem> recommendables);


}
