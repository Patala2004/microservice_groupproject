package group5.ms.tongji.upref.service.weight;

import group5.ms.tongji.upref.domain.InteractionTypes;
import group5.ms.tongji.upref.domain.InteractionTypesWeights;
import group5.ms.tongji.upref.model.primary.UserFrequentTag;
import group5.ms.tongji.upref.model.primary.UserTagKey;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Component("BasicWeightCalculator")
@AllArgsConstructor
public class BasicWeightCalculator implements WeightCalculator {
    @Override
    public void computeWeights(int userId, List<Integer> tags, HashMap<Integer, UserFrequentTag> userFrequentTags, Date timestamp, InteractionTypes interactionType) {
        for(Integer tag : tags) {
            if(!userFrequentTags.containsKey(tag)) {
                UserTagKey userTag = new UserTagKey(userId, tag);
                UserFrequentTag newFrequentTag = new UserFrequentTag(userTag, 0.1f, timestamp);
                userFrequentTags.put(tag, newFrequentTag);
            }
            UserFrequentTag userFrequentTag = userFrequentTags.get(tag);
            updateWeight(userFrequentTag, interactionType);
            userFrequentTag.setTimestamp(timestamp);
        }
    }

    private void updateWeight(UserFrequentTag u, InteractionTypes iteractionType) {
        float impact = 1 / (1 + u.getWeight());
        float typeWeight = InteractionTypesWeights.WEIGHTS.get(iteractionType);
        u.setWeight(u.getWeight()+impact*typeWeight);
    }
}
