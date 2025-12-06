package group5.ms.tongji.recommendation.service;

import group5.ms.tongji.recommendation.dto.UserFrequentTag;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashMap;

@AllArgsConstructor
@Component
public class TagMapper {
    public HashMap<Integer, Float> toWeightMap(UserFrequentTag[] tags) {
            HashMap<Integer, Float> map = new HashMap<>();
        for (UserFrequentTag t : tags) {
            map.put(t.getUserTag().getTagId(), t.getWeight());
        }
        return map;
    }
}
