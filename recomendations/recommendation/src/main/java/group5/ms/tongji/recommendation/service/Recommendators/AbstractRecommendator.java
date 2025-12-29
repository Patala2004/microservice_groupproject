package group5.ms.tongji.recommendation.service.Recommendators;

import java.util.PriorityQueue;

public class AbstractRecommendator{

    protected int[] extractRecommendationsId(PriorityQueue<Recommendation> bestFinds) {
        int size = bestFinds.size();
        int[] recommendationsId = new int[bestFinds.size()];
        for(int i = 0; i < size; i++) {
            Recommendation r = bestFinds.poll();
            recommendationsId[size-1-i] = r.getRecommendedId();
        }
        return recommendationsId;
    }
}
