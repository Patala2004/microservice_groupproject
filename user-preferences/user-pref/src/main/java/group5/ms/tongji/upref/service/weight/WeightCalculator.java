package group5.ms.tongji.upref.service.weight;


import group5.ms.tongji.upref.domain.InteractionTypes;
import group5.ms.tongji.upref.model.primary.UserFrequentTag;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

public interface WeightCalculator {
    public void computeWeights(int userId, List<Integer> tags, HashMap<Integer, UserFrequentTag> userFrequentTags, Date timestamp, InteractionTypes interactionType);
}
